import {
  authService,
  LoginData,
  RegisterData,
  UpdateProfileData,
} from '../services/authService';

// Contoh penggunaan login
export async function loginExample() {
  const loginData: LoginData = {
    email: 'user@example.com',
    password: 'password123',
  };

  try {
    const response = await authService.login(loginData);

    if (response.success) {
      console.log('Login successful!');
      console.log('User:', response.data?.user);
      console.log('Token:', response.data?.token);

      // Simpan token ke localStorage atau state management
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
    }
  } catch (error) {
    console.error(
      'Login failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    // Handle error - tampilkan ke user
  }
}

// Contoh penggunaan register
export async function registerExample() {
  const registerData: RegisterData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    password: 'password123',
    confirmPassword: 'password123',
  };

  try {
    const response = await authService.register(registerData);

    if (response.success) {
      console.log('Registration successful!');
      console.log('User:', response.data?.user);
      console.log('Token:', response.data?.token);

      // Simpan token ke localStorage atau state management
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
    }
  } catch (error) {
    console.error(
      'Registration failed:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    // Handle error - tampilkan ke user
    // Error message akan berisi detail validation errors jika ada
  }
}

// Contoh penggunaan get profile
export async function getProfileExample() {
  try {
    const response = await authService.getProfile();

    if (response.success) {
      console.log('Profile retrieved successfully!');
      console.log('User:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error(
      'Failed to get profile:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    // Handle error - tampilkan ke user
  }
}

// Contoh penggunaan update profile
export async function updateProfileExample() {
  const updateData: UpdateProfileData = {
    name: 'John Doe Updated',
    phone: '081234567891',
    currentPassword: 'oldpassword123',
    newPassword: 'newpassword123',
  };

  try {
    const response = await authService.updateProfile(updateData);

    if (response.success) {
      console.log('Profile updated successfully!');
      console.log('Updated user:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error(
      'Failed to update profile:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    // Handle error - tampilkan ke user
  }
}

// Contoh menangani error response
export function handleAuthError(error: Error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  // Cek jenis error berdasarkan message
  if (errorMessage.includes('Invalid credentials')) {
    return 'Email atau password salah';
  } else if (errorMessage.includes('User already exists')) {
    return 'Email sudah terdaftar';
  } else if (errorMessage.includes('Phone number already exists')) {
    return 'Nomor telepon sudah digunakan';
  } else if (errorMessage.includes('Validation failed')) {
    return 'Data tidak valid: ' + errorMessage;
  } else if (errorMessage.includes('Unauthorized')) {
    return 'Sesi telah berakhir, silakan login kembali';
  } else {
    return 'Terjadi kesalahan: ' + errorMessage;
  }
}
