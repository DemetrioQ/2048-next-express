'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import leo from "leo-profanity";
import { useAuth } from "@/context/AuthContext";
import { checkUsernameAvailable } from "@/utils/api";

const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

const validateUsername = (username: string) =>
  /^[a-zA-Z0-9_]+$/.test(username) &&
  username.length >= 3 &&
  username.length <= 20 &&
  !leo.check(username);

const usernameChecklist = (username: string) => [
  {
    label: "Only letters, numbers, and underscores",
    valid: /^[a-zA-Z0-9_]+$/.test(username),
  },
  {
    label: "3–20 characters long",
    valid: username.length >= 3 && username.length <= 20,
  },
  {
    label: "No inappropriate words",
    valid: !leo.check(username),
  },
];

const passwordChecklist = (password: string) => [
  {
    label: "At least 8 characters",
    valid: password.length >= 8,
  },
  {
    label: "At least one uppercase letter",
    valid: /[A-Z]/.test(password),
  },
  {
    label: `At least one symbol (${SYMBOLS})`,
    valid: new RegExp(`[${SYMBOLS.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")}]`).test(password),
  },
];

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    leo.loadDictionary("en");
  }, []);

  useEffect(() => {
    if (!username || !validateUsername(username)) {
      setIsUsernameAvailable(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const data = await checkUsernameAvailable(username);
        setIsUsernameAvailable(data.available);
      } catch {
        setIsUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValid = validateEmail(email);
    const usernameErrors = usernameChecklist(username).some(c => !c.valid);
    const passwordErrors = passwordChecklist(password).some(c => !c.valid);
    const confirmPasswordValid = password === confirmPassword;

    if (!emailValid || usernameErrors || passwordErrors || !confirmPasswordValid || isUsernameAvailable === false) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    try {
      setSubmitting(true);
      await register({ email, username, password });
      toast.success("Registered successfully");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getClass = (valid: boolean, typed: boolean) => {
    if (!typed) return "text-gray-500";
    return valid ? "text-green-600" : "text-red-500";
  };

  const typedUsername = username.length > 0;
  const typedPassword = password.length > 0;
  const typedConfirm = confirmPassword.length > 0;
  const typedEmail = email.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className={`text-sm mt-1 ${getClass(validateEmail(email), typedEmail)}`}>
          {validateEmail(email) ? "✓ Valid email format" : "✗ Invalid email format"}
        </p>
      </div>

      {/* Username */}
      <div>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded"
          value={username}
          onFocus={() => setUsernameFocused(true)}
          onBlur={() => setUsernameFocused(false)}
          onChange={(e) => setUsername(e.target.value)}
        />
        {(usernameFocused || usernameChecklist(username).some(c => !c.valid))  && (
          <div className="mt-1 space-y-1 text-sm transition-opacity duration-200 ease-in-out opacity-100">
            {usernameChecklist(username).map((item, idx) => (
              <p key={idx} className={getClass(item.valid, typedUsername)}>
                {item.valid ? "✓" : "✗"} {item.label}
              </p>
            ))}

            {validateUsername(username) && (
              <p
                className={`text-sm ${
                  isUsernameAvailable === null
                    ? "text-gray-400"
                    : isUsernameAvailable
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isCheckingUsername
                  ? ""
                  : isUsernameAvailable
                  ? "✓ Username is available"
                  : "✗ Username is taken"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          onChange={(e) => setPassword(e.target.value)}
        />
        {(passwordFocused || passwordChecklist(password).some(c => !c.valid)) && (
          <div className="mt-1 space-y-1 text-sm transition-opacity duration-200 ease-in-out opacity-100">
            {passwordChecklist(password).map((item, idx) => (
              <p key={idx} className={getClass(item.valid, typedPassword)}>
                {item.valid ? "✓" : "✗"} {item.label}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <p className={`text-sm mt-1 ${getClass(confirmPassword === password, typedConfirm)}`}>
          {confirmPassword === password ? "✓ Passwords match" : "✗ Passwords do not match"}
        </p>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
