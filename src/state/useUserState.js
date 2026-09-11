import { globalState } from "@/lib/globalState";

export const useUserState = globalState("user", {});
export default useUserState;

/*
Usage:

import { useUserState } from '@/state/useUserState';

function MyComponent() {
  const [user, setUser] = useUserState();

  const handleSetUser = () => {
    setUser({ name: 'John Doe', age: 30 });
  };

  const handleUpdateUser = () => {
    setUser(prev => ({ ...prev, age: prev.age + 1 }));
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <button onClick={handleSetUser}>Set User</button>
      <button onClick={handleUpdateUser}>Increment Age</button>
    </div>
  );
}
*/
