// SecurityTab.tsx
export default function SecurityTab() {
  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Password</h2>
      <p className="mb-2">You can change your password from here.</p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Change Password (coming soon)
      </button>

      <h2 className="text-lg font-semibold mt-6 mb-2">Two-Factor Authentication</h2>
      <p className="mb-2">2FA is not enabled.</p>
      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
        Set up 2FA (coming soon)
      </button>
    </>
  );
}
