import * as K from "@fpk/k8s";

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
    "10-deployment": K.deploymentWithContainer({
      name,
      image,
      replicas,
      containerPort,
      env,
    }),

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
