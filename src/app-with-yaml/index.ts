import { webWorkload } from "../../lib/web";

export default webWorkload({
  name: "app-with-yaml",
  replicas: 2,

  image: "myorg/another-web-app:latest",
  containerPort: 3000,
  env: {},

  host: "yaml.example.com",
});
