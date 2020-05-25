import { webWorkload } from "../lib/web";
import { TDefaultContext } from "../contexts/default";

export default ({ webapp: { replicas, host } }: TDefaultContext) =>
  webWorkload({
    name: "mywebapp",
    replicas,

    image: "myorg/myappimage:latest",
    containerPort: 8080,
    env: {
      FOO: "bar",
    },

    host,
  });
