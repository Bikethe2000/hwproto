function createEntity(entityName) {
  return {
    list: async () => [],
    filter: async () => [],
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    get: async () => ({}),
  };
}

const base44 = {
  auth: {
    me: async () => ({ id: null, email: null }),
    loginViaEmailPassword: async () => ({}),
    loginWithProvider: () => {},
    register: async () => ({}),
    verifyOtp: async () => ({ access_token: 'fake' }),
    setToken: () => {},
    resendOtp: async () => ({}),
    resetPasswordRequest: async () => ({}),
    resetPassword: async () => ({}),
    logout: () => {},
    redirectToLogin: () => {},
  },
  entities: new Proxy({}, {
    get(target, prop) {
      if (!target[prop]) {
        target[prop] = createEntity(prop.toString());
      }
      return target[prop];
    },
  }),
  integrations: {
    Core: {
      UploadFile: async ({ file }) => ({ file_url: '', file_name: file?.name ?? '' }),
      SendEmail: async () => ({}),
      InvokeLLM: async () => ({ text: '' }),
    },
  },
};

export { base44 };
