// ProfileTabs.tsx
import * as Tabs from '@radix-ui/react-tabs';
import AccountInfoTab from './AccountInfoTab';
import SecurityTab from './SecurityTab';

export default function ProfileTabs() {
  return (
    <Tabs.Root defaultValue="account" className="w-full">
      <Tabs.List className="flex border-b mb-4">
        <Tabs.Trigger
          value="account"
          className="px-4 py-2 font-medium hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Account Information
        </Tabs.Trigger>
        <Tabs.Trigger
          value="security"
          className="px-4 py-2 font-medium hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Security
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="account">
        <AccountInfoTab />
      </Tabs.Content>

      <Tabs.Content value="security">
        <SecurityTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}
