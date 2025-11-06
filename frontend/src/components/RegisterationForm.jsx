import { useState } from "react";

export default function Register() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
      firstname: '',
      lastname: '',
      address: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match'});
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters'})
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/reg/request-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          password: formData.password
        })

      })
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration Failed')
      }

      setMessage({ type: 'success', text: 'Verification Code sent to email'});
      setTimeout(() => {
        setStep(2);
        setMessage({ type: '', text: '' });
      }, 1500);

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Registration Failed. Please try again.' })

    } finally {
      setLoading(false);
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' })

    if (!verificationCode || verificationCode.length != 6) {
      setMessage({ type: 'error', text: 'Code is invalid' })
      return;
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/reg/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: verificationCode
        })
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification Failed')
      }

      setMessage({ type: 'success', text: 'Registration Successful! You can now login' })

      setTimeout(() => {
        setFormData({ firstname: '', lastname: '', address: '', phone: '', email: '', password: '', confirmPassword: '' });
        setVerificationCode('');
        setStep(1)
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Verification Failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Join Us Today!</p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Enter your First Name"/>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Enter your Last Name"/>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Input your address"/>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Input your Phone Number"/>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Fill in your email address"/>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Please use a password"/>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Re-enter your password"/>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-800 text-green-200'
                  : 'bg-red-50 border-red-800 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Sign Up'}
            </button>
            
            <p className="text-center text-gray-600 text-sm mt-6">
              Already Have an Account?{' '}
              <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                Sign In
              </span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
              <p className="text-gray-600">We sent a verification code to</p>
              <p className="text-gray-800 font-medium">{formData.email}</p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl font-mono tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              {message.text && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
              
            </div>
          </>
        )}
      </div>
    </div>
  )
}