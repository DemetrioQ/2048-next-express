'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import leo from 'leo-profanity';
import { changeUserName } from '@/utils/api';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuth } from '@/context/AuthContext';

export default function UsernamePrompt() {
  const { refreshUser } = useAuth();
  const [open, setOpen] = useState(true); // ✅ control dialog visibility
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    leo.loadDictionary('en');
  }, []);

  const validate = (name: string) => {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return 'Only letters, numbers, and underscores allowed.';
    if (name.length < 3 || name.length > 20) return 'Must be 3–20 characters.';
    if (leo.check(name)) return 'Inappropriate username.';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsername(val);
    setError(validate(val));
  };

  const handleSubmit = async () => {
    const err = validate(username);
    if (err) return setError(err);

    setSubmitting(true);
    try {
      const res = await changeUserName(username);
      console.log(res)
      if (res.username) {
        await refreshUser();
        setOpen(false); 
      } else {
        setError(res.message || 'Username not available');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed z-[110] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl p-6 shadow-xl">
          <Dialog.Title className="text-center text-xl font-bold mb-2">Choose a Username</Dialog.Title>

          <label className="block text-sm font-medium mb-1">Pick a username</label>
          <input
            value={username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400 mb-2"
            placeholder="Enter username"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!!error || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Save'}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
