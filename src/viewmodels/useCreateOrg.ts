import { useState } from 'react';
import { organisationService } from '../services/organisation.service';
import { Organisation } from '../types/organisation.types';

export function useCreateOrg(onCreated: (org: Organisation) => void, onClose: () => void) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  function reset() {
    setName('');
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError('Organisation name is required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const org = await organisationService.create(name.trim());
      if (!org?.id) {
        setError('Failed to create organisation. Please try again.');
        return;
      }
      reset();
      onCreated(org);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return { name, setName, slug, loading, error, handleClose, handleCreate };
}
