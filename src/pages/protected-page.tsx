import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState, useCallback } from "react";
import { PageLayout } from "../components/page-layout";
import { getAllSecrets, getDecryptedSecretById, createSecret } from '../services/secrets.service';
import { SecretModal } from "../components/modals";

interface Secret {
  _id: string;
  name: string;
  description: string;
  encrypted: string;
  iv: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  decrypted?: string; // Add an optional decrypted field to store the decrypted secret
}

export const ProtectedPage: React.FC = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmit = async (value: any) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await createSecret(value.name, value.description, value.secretValue, accessToken);

      if (error || !data) {
        console.log(error || "Failed to create secret.");
      }

      setSecrets((prevSecrets) => [...prevSecrets, data]);
    } catch (err: any) {
      console.error(err);
      setError(`Error creating secret: ${err.message}`);
    }
  }

  // Handle decryption of secret
  const handleGetDecryptedSecret = async (id: string) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await getDecryptedSecretById(id, accessToken);

      if (error || !data) {
        console.log(error || "Failed to decrypt secret.");
      }

      setSecrets((prevSecrets) =>
        prevSecrets.map((secret) =>
          secret._id === id ? { ...secret, decrypted: data.decryptedValue } : secret
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(`Error decrypting secret: ${err.message}`);
    }
  };

  // handle submit

  // Fetch all secrets
  const getSecrets = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await getAllSecrets(accessToken);

      if (error || !data) {
        console.log(error || "Failed to fetch secrets.");
      }

      setSecrets(data);
    } catch (err: any) {
      console.error(err);
      setError(`Error fetching secrets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  // useEffect to fetch secrets on mount
  useEffect(() => {
    getSecrets();
  }, [getSecrets]);

  if (loading) {
    return (
      <PageLayout>
        <div className="content-layout">
          <h1>Loading secrets...</h1>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="content-layout">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Secrets <button onClick={() => setIsOpen(true)}>+</button>
        </h1>
        <SecretModal open={isOpen} onClose={() => setIsOpen(false)} onSubmit={onSubmit} />
        <div className="content__body">
          <p id="page-description">
            <span>
              This page retrieves a <strong>protected message</strong> from an external API.
            </span>
            <span>
              <strong>Only authenticated users can access this page.</strong>
            </span>
          </p>

          {secrets.length > 0 ? (
            <ul>
              {secrets.map((secret) => (
                <li key={secret._id}>
                  <strong>Name:</strong> {secret.name} <br />
                  <strong>Description:</strong> {secret.description} <br />
                  <strong>Created At:</strong> {new Date(secret.createdAt).toLocaleString()}
                  <br />
                  {secret.decrypted ? (
                    <>
                      <br />
                      <strong>Decrypted:</strong> {secret.decrypted}
                    </>
                  ) : (
                    <>

                      {!secret.decrypted && <span><strong>Secret: &nbsp;</strong>{secret.encrypted} <button onClick={() => handleGetDecryptedSecret(secret._id)}>
                        Decrypt
                      </button></span>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No secrets available</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};