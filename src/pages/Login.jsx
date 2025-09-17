import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../config/firebase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import { Github, Mail, Eye, EyeOff, Lock, User } from "lucide-react";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { ImageWithFallback } from "../components/FallBackImage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useScrollToTop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/user-not-found":
          setError(
            "No account found with this email address. Please sign up first."
          );
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Wrong credentials. Please check your email and password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled. Please contact support.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;
        default:
          setError("Login failed. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);

      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Login cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError("Popup blocked. Please allow popups and try again.");
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with this email using a different sign-in method."
          );
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;
        default:
          setError("Google login failed. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, githubProvider);
      navigate("/");
    } catch (error) {
      console.error("GitHub login error:", error);

      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Login cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError("Popup blocked. Please allow popups and try again.");
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with this email using a different sign-in method."
          );
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;
        default:
          setError("GitHub login failed. Please try again.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-river-50 via-background to-river-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full pt-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your ByteBites account
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 text-base font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full h-12 text-base font-medium"
            >
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                {error}
                {error.includes("Please sign up first") && (
                  <div className="mt-2">
                    <Link
                      to="/signup"
                      className="text-primary hover:text-primary/80 underline font-medium"
                    >
                      Go to Sign Up page
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Sign in with Email
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
