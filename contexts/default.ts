const value = {
  myapp: {
    replicas: 5,
  },

  webapp: {
    replicas: 10,
    host: "webapp.example.com",
  },

  anotherwebapp: {
    replicas: 5,
    host: "another.example.com",
  },
};

export type TDefaultContext = typeof value;

export default value;
