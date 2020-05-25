import * as K from "@fpk/k8s";
import { TDefaultContext } from "../contexts/default";

export default ({ myapp }: TDefaultContext) =>
  K.withNamespace("myapp")({
    "10-deployment": K.deploymentWithContainer({
      name: "myapp",
      image: "myimage",
      replicas: myapp.replicas,
      containerPort: 3000,
      env: {
        FOO: "bar",
      },
    }),
  });
