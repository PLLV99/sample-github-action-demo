# 📊 เปรียบเทียบ Jenkins vs GitHub Actions

## สำหรับโปรเจกต์ Express.js นี้

### 🏗️ โครงสร้าง Pipeline

| Feature | Jenkins | GitHub Actions |
|---------|---------|----------------|
| **Configuration File** | `Jenkinsfile` | `.github/workflows/main.yml` |
| **Syntax** | Groovy DSL | YAML |
| **Location** | Root directory | `.github/workflows/` |
| **Triggers** | SCM polling, Webhooks, Manual | push, pull_request, workflow_dispatch |

---

### 🔄 Workflow Stages

#### Jenkins Stages
```groovy
1. Checkout
2. Install & Test (Docker agent)
3. Build Docker Image
4. Push Docker Image
5. Cleanup Docker
6. Deploy Local
7. Build Summary
```

#### GitHub Actions Jobs
```yaml
1. build-and-test
   - Checkout, Install, Test, Upload Coverage
2. build-docker
   - Build & Push Docker Image
3. security-scan
   - Trivy vulnerability scanning
4. deploy
   - Deploy to production
```

---

### ⚙️ Environment Variables

#### Jenkins
```groovy
environment {
    DOCKER_HUB_CREDENTIALS_ID = 'dockerhub-cred'
    DOCKER_REPO = "iamsamitdev/express-docker-app"
    DEV_APP_NAME = "express-app-dev"
}
```

#### GitHub Actions
```yaml
env:
  NODE_VERSION: '22'
  DOCKER_IMAGE: 'yourusername/express-app'
```

---

### 🔐 Secrets Management

#### Jenkins
- จัดการผ่าน Jenkins UI
- Credentials Plugin
- ID-based reference: `dockerhub-cred`

```groovy
docker.withRegistry('https://index.docker.io/v1/', 
    env.DOCKER_HUB_CREDENTIALS_ID)
```

#### GitHub Actions
- จัดการผ่าน GitHub UI
- Repository Settings → Secrets
- Access via `${{ secrets.NAME }}`

```yaml
username: ${{ secrets.DOCKERHUB_USERNAME }}
password: ${{ secrets.DOCKERHUB_TOKEN }}
```

---

### 🚀 Deployment Strategy

#### Jenkins
```groovy
// Multi-branch support
- develop → DEV environment (port 3001)
- main → PROD environment (port 3000) + Approval
- Rollback support with parameters
```

#### GitHub Actions
```yaml
# Environment-based deployment
- main branch → production
- PR to main → test only
- Manual trigger with workflow_dispatch
```

---

### 🧪 Testing Approach

#### Jenkins
```groovy
stage('Install & Test') {
    agent {
        docker {
            image 'node:22-alpine'
            args '-u root'
        }
    }
    steps {
        sh 'npm ci && npm test'
    }
}
```

#### GitHub Actions
```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'

- name: Run tests
  run: npm test
```

---

### 🐳 Docker Handling

#### Jenkins
```groovy
// Build
docker.build("${DOCKER_REPO}:${IMAGE_TAG}")

// Push with withRegistry
docker.withRegistry('...', CREDENTIALS_ID) {
    image.push()
    image.push('latest')
}

// Manual cleanup required
docker image rm -f ${DOCKER_REPO}:${IMAGE_TAG}
```

#### GitHub Actions
```yaml
# Build & Push in one action
- uses: docker/build-push-action@v5
  with:
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

---

### 📊 Advantages & Disadvantages

| Aspect | Jenkins | GitHub Actions |
|--------|---------|----------------|
| **💰 Cost** | Self-hosted (free) but requires server | Free tier: 2000 min/month |
| **🔧 Setup** | ต้องติดตั้งและดูแล server | ไม่ต้องติดตั้ง setup ง่าย |
| **🎨 Flexibility** | สูงมาก (plugins, custom logic) | จำกัดด้วย YAML syntax |
| **🚀 Speed** | ขึ้นกับ server resources | Fast (GitHub infrastructure) |
| **📚 Learning Curve** | สูง (Groovy DSL) | ต่ำ (YAML) |
| **🔌 Integration** | ต้องติดตั้ง plugins | Built-in GitHub integration |
| **🔄 Rollback** | Manual implementation | ต้องเขียน workflow เอง |
| **👥 Team Access** | Jenkins user management | GitHub repository access |
| **📈 Scalability** | ต้องจัดการ agents เอง | Auto-scaling |

---

### 🎯 Use Cases

#### เมื่อไหร่ควรใช้ Jenkins?

✅ มี server สำหรับ host Jenkins อยู่แล้ว
✅ ต้องการ full control และ flexibility สูง
✅ มี workflow ที่ซับซ้อนมาก
✅ ใช้ on-premise infrastructure
✅ ต้องการ integrate กับ tools หลากหลาย
✅ มีทีม DevOps ดูแล

#### เมื่อไหร่ควรใช้ GitHub Actions?

✅ โค้ดอยู่บน GitHub อยู่แล้ว
✅ ต้องการ setup ง่ายและรวดเร็ว
✅ ไม่อยากดูแล infrastructure
✅ ทีมเล็ก และ workflow ไม่ซับซ้อนมาก
✅ ต้องการ integration กับ GitHub โดยตรง
✅ งบประมาณจำกัด (ใช้ free tier)

---

### 💡 Best Practices

#### Jenkins
```groovy
1. ใช้ Declarative Pipeline (ไม่ใช่ Scripted)
2. แยก stages ให้ชัดเจน
3. ใช้ Docker agents สำหรับ isolation
4. Implement proper error handling
5. Clean up resources (docker images)
6. Use shared libraries สำหรับโค้ดที่ใช้ซ้ำ
```

#### GitHub Actions
```yaml
1. แยก jobs ตาม responsibilities
2. ใช้ official actions จาก marketplace
3. Cache dependencies เพื่อเร่งความเร็ว
4. ใช้ matrix strategy สำหรับ multi-version testing
5. Implement proper secrets management
6. ใช้ environments สำหรับ production deployments
```

---

### 📈 Performance Comparison

| Metric | Jenkins (Self-hosted) | GitHub Actions |
|--------|----------------------|----------------|
| **Startup Time** | Depends on agent | ~10-20 seconds |
| **Build Cache** | Manual setup | Built-in (GHA cache) |
| **Parallel Jobs** | Limited by agents | Free: 20, Pro: 40+ |
| **Artifact Storage** | Manual setup | Built-in (90 days) |
| **Logs Retention** | Manual setup | 90 days default |

---

### 🔄 Migration Path

#### จาก Jenkins → GitHub Actions

1. **วิเคราะห์ Jenkinsfile**
   - ระบุ stages และ steps
   - list environment variables
   - ระบุ secrets ที่ใช้

2. **สร้าง Workflow YAML**
   - แปลง stages → jobs
   - แปลง steps → actions
   - ตั้งค่า secrets ใน GitHub

3. **Test และ Validate**
   - รัน workflow แบบ manual
   - ตรวจสอบ logs
   - แก้ไขปัญหา

4. **Production Deployment**
   - Switch จาก Jenkins → GitHub Actions
   - Monitor และ optimize

---

### 📝 สรุป

**Jenkins** เหมาะสำหรับ:
- Enterprise projects
- Complex workflows
- On-premise infrastructure
- Full control requirements

**GitHub Actions** เหมาะสำหรับ:
- Modern cloud-native apps
- GitHub-hosted projects
- Quick setup & deployment
- Small to medium teams

**ทั้งสองตัวดีและมีจุดแข็งของตัวเอง การเลือกใช้ขึ้นอยู่กับ:**
- ขนาดทีมและโปรเจกต์
- Infrastructure ที่มีอยู่
- งบประมาณ
- ความซับซ้อนของ workflow
- ทักษะของทีม

---

**สำหรับโปรเจกต์ตัวอย่างนี้:**
- ✅ **GitHub Actions** เหมาะกว่า เพราะ setup ง่าย, ไม่ต้องดูแล server, และ integrate กับ GitHub ได้ดี
- ⚠️ **Jenkins** จะเหมาะถ้ามี server อยู่แล้ว และต้องการ flexibility สูง
