import { webWorkload } from "../lib/web";

export default webWorkload({
  name: "mywebapp",
  replicas: 10,

  image: "myorg/myappimage:latest",
  containerPort: 8080,
  env: {
    FOO: "bar",
  },

  host: "mywebapp.example.com",
});
