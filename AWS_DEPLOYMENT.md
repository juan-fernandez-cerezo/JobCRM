# Guía de Despliegue - Docker, Kubernetes y AWS (ECR/EKS)

Esta guía documenta los pasos necesarios para desplegar **JobTracker Pro** de manera profesional y escalable en Amazon Web Services (AWS) utilizando **Docker**, **Amazon ECR** (Elastic Container Registry) y **Amazon EKS** (Elastic Kubernetes Service).

---

## 🛠️ Prerrequisitos

Asegúrate de tener instalados y configurados los siguientes programas en tu máquina local:
1. **Docker**: Para construir la imagen del contenedor. [Instalar Docker](https://docs.docker.com/get-docker/)
2. **AWS CLI**: Para interactuar con tu cuenta de AWS. Configurado con `aws configure`. [Instalar AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. **eksctl**: La herramienta oficial de línea de comandos para crear y administrar clústeres en Amazon EKS. [Instalar eksctl](https://eksctl.io/installation/)
4. **kubectl**: El cliente de Kubernetes para interactuar con tu clúster. [Instalar kubectl](https://kubernetes.io/docs/tasks/tools/)

---

## 📁 Estructura del Despliegue

La configuración del entorno incluye los siguientes archivos clave que ya han sido creados en el repositorio:
* **`Dockerfile`**: Compilación multietapa de la aplicación React y hosting bajo un servidor Nginx ligero de producción.
* **`nginx.conf`**: Configuración optimizada de Nginx con compresión GZIP y soporte para Single Page Applications (SPA).
* **`k8s/deployment.yaml`**: Manifiesto K8s con 2 réplicas y recursos de CPU/Memoria limitados.
* **`k8s/service.yaml`**: Servicio K8s LoadBalancer para aprovisionar un balanceador de carga público en AWS.

---

## 🚀 Guía de Ejecución Paso a Paso

### Paso 1: Crear el Registro de Docker en AWS (ECR)

Primero, creamos un repositorio privado en AWS ECR para almacenar nuestras imágenes de contenedor.

1. **Crear el repositorio** (reemplaza `us-east-1` por tu región deseada):
   ```bash
   aws ecr create-repository --repository-name jobtracker-pro --region us-east-1
   ```
   *Guarda el valor de `repositoryUri` que devuelva el comando (ej: `123456789012.dkr.ecr.us-east-1.amazonaws.com/jobtracker-pro`).*

2. **Autenticar Docker con tu registro de AWS ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
   ```
   *(Reemplaza `123456789012` por tu ID de cuenta de AWS de 12 dígitos).*

---

### Paso 2: Compilar y Subir la Imagen Docker

1. **Construir la imagen de producción** (ejecuta en la raíz del proyecto):
   ```bash
   docker build -t jobtracker-pro:latest .
   ```

2. **Asociar un Tag de ECR a la imagen compilada**:
   ```bash
   docker tag jobtracker-pro:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/jobtracker-pro:latest
   ```

3. **Subir la imagen (Push) a AWS ECR**:
   ```bash
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/jobtracker-pro:latest
   ```

---

### Paso 3: Crear el Clúster de Kubernetes (EKS)

Usamos `eksctl` para aprovisionar automáticamente un clúster EKS listo para producción (crea VPC, subredes, IAM roles y nodos EC2 de soporte):

1. **Ejecutar el comando de aprovisionamiento**:
   ```bash
   eksctl create cluster \
     --name jobtracker-eks \
     --region us-east-1 \
     --nodegroup-name standard-nodes \
     --node-type t3.medium \
     --nodes 2 \
     --nodes-min 1 \
     --nodes-max 3 \
     --managed
   ```
   *Nota: Este proceso toma entre 10 y 15 minutos en AWS mientras se levantan las subredes y los balanceadores internos.*

---

### Paso 4: Desplegar la Aplicación en el Clúster

1. **Vincular el archivo de configuración de Kubernetes (`deployment.yaml`)**:
   Edita el archivo `k8s/deployment.yaml` en la línea 19 y cambia la URL de la imagen de ejemplo por tu URL de imagen real de ECR:
   ```yaml
   image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/jobtracker-pro:latest
   ```

2. **Configurar tu sesión local de kubectl con AWS EKS**:
   ```bash
   aws eks update-kubeconfig --region us-east-1 --name jobtracker-eks
   ```

3. **Aplicar los manifiestos de Kubernetes**:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

---

### Paso 5: Monitorear y Obtener la URL Pública

1. **Verificar el estado de los Pods**:
   ```bash
   kubectl get pods -l app=jobtracker-pro
   ```

2. **Obtener el endpoint público**:
   ```bash
   kubectl get service jobtracker-pro-service
   ```

   Verás una salida similar a esta:
   ```text
   NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP                                                              PORT(S)        AGE
   jobtracker-pro-service   LoadBalancer   10.100.200.50   a1b2c3d4e5f6g7h8i9j0-123456789.us-east-1.elb.amazonaws.com               80:31256/TCP   1m
   ```

3. Copia el host completo bajo la columna **`EXTERNAL-IP`** (ej: `a1b2c3d4e5f6g7h8i9j0-123456789.us-east-1.elb.amazonaws.com`) y pégalo en tu navegador para interactuar con la aplicación. ¡Tu CRM de búsqueda de empleo ya está activo y escalando en AWS!

---

## 🧹 Limpieza de Recursos (Evitar facturación residual)

Cuando desees eliminar la infraestructura de AWS para evitar costes en tu cuenta, ejecuta los siguientes comandos en orden:

1. **Eliminar los servicios y recursos de K8s**:
   ```bash
   kubectl delete -f k8s/service.yaml
   kubectl delete -f k8s/deployment.yaml
   ```
2. **Destruir el clúster de EKS**:
   ```bash
   eksctl delete cluster --name jobtracker-eks --region us-east-1
   ```
3. **Eliminar el repositorio en ECR**:
   ```bash
   aws ecr delete-repository --repository-name jobtracker-pro --region us-east-1 --force
   ```
