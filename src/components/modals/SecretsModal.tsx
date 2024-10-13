import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';

interface SecretModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, secretValue: string) => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const SecretModal: React.FC<SecretModalProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [secretValue, setSecretValue] = useState('');

  const handleSubmit = () => {
    onSubmit(name, description, secretValue);
    onClose();
    // Reset the form fields
    setName('');
    setDescription('');
    setSecretValue('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h2>Create/Edit Secret</h2>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }} // Add margin-bottom for spacing
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }} // Add margin-bottom for spacing
        />
        <TextField
          label="Secret Value"
          variant="outlined"
          fullWidth
          type="password" // Use 'password' for security
          value={secretValue}
          onChange={(e) => setSecretValue(e.target.value)}
          sx={{ mb: 2 }} // Add margin-bottom for spacing
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Submit
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ mt: 2, ml: 2 }}>
            Cancel
        </Button>
      </Box>
    </Modal>
  );
};