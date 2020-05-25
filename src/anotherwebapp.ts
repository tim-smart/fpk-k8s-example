import { webWorkload } from "../lib/web";
import { TDefaultContext } from "../contexts/default";

export default ({ anotherwebapp: { host, replicas } }: TDefaultContext) =>
  webWorkload({
    name: "another-web-app",
    replicas,

    image: "myorg/another-web-app:latest",
    containerPort: 3000,
    env: {},

    host,
  });
