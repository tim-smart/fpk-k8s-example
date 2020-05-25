import * as K from "@fpk/k8s";
import * as R from "ramda";

export interface IWebWorkloadOpts {
  name: string;
  replicas: number;

  image: string;
  containerPort: number;
  env: K.IEnvObject;

  host: string;
}

export const webWorkload = ({
  name,
  image,
  replicas,
  containerPort,
  env,
  host,
}: IWebWorkloadOpts) =>
  K.withNamespace(name)({
    "10-deployment": R.pipe(
      K.setDeploymentRollingUpdate({
        maxSurge: "25%",
        maxUnavailable: 2,
      }),
      K.appendContainer({
        name: "super-sidecar",
        image: "myorg/sidecar:v1.0.0",
      }),
      K.overContainer(
        name,
        R.pipe(K.setReadinessProbe(), K.setLivenessProbe()),
      ),
    )(
      K.deploymentWithContainer({
        name,
        image,
        replicas,
        containerPort,
        env,
      }),
    ),

    "10-service": K.serviceWithPort(name, { app: name }, containerPort),

    "10-ingress": K.ingressFromRules(name, {
      backend: {
        serviceName: name,
        servicePort: containerPort,
      },

      tlsAcme: true,
      tlsRedirect: true,
      tlsSecretName: `${name}-tls`,

      rules: [{ host }],
    }),
  });
