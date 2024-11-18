# 🖋️ Blogging System based on AWS Services 🌐  

This is a **basic blogging website** built using modern **AWS services** and tools to deliver a scalable and feature-rich blogging platform. 🚀  

## ✨ Features  
- 🔐 **Authentication**: User authentication powered by [**Amazon Cognito**](https://aws.amazon.com/cognito/).  
- 📝 **CRUD Operations**: Seamless management of blog posts using [**DynamoDB**](https://aws.amazon.com/dynamodb/).  
- 🖼️ **Media Management**: Store and retrieve images using [**Amazon S3**](https://aws.amazon.com/s3/).  
- ✍️ **Rich Text Editor**: Create and edit blog posts with an intuitive interface using [**TipTap Editor**](https://tiptap.dev/).  
- 📊 **GraphQL API**: Efficient data handling with [**AWS AppSync**](https://aws.amazon.com/appsync/) and GraphQL.  
- 🎨 **Frontend Frameworks and Tools**:  
  - Built with [**Amplify**](https://docs.amplify.aws/) for easy AWS integration.  
  - Styled using [**Tailwind CSS**](https://tailwindcss.com/) for a modern and responsive UI.  
  - Code quality enforced with [**ESLint**](https://eslint.org/).  

---

## 💻 Tech Stack  
| **Category**       | **Technology**       |  
|--------------------|----------------------|  
| **Frontend**       | [Next.js](https://nextjs.org/)  |  
| **Backend**        | [AWS Amplify](https://docs.amplify.aws/), [GraphQL](https://graphql.org/) |  
| **Database**       | [DynamoDB](https://aws.amazon.com/dynamodb/) |  
| **File Storage**   | [Amazon S3](https://aws.amazon.com/s3/) |  
| **Authentication** | [Amazon Cognito](https://aws.amazon.com/cognito/) |  
| **Editor**         | [TipTap](https://tiptap.dev/) |  
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/) |  

---

## 🚀 Getting Started  

To get started with this project:  

1. **Clone the repository:**  
   ```bash  
   git clone https://github.com/your-repo-url.git  
   cd Blogging-System-based-on-AWS  
   ```

2. **Install the required dependencies:**  
   ```bash  
   npm i
   ```

3. **Set up AWS Services:**  
   ```bash  
   amplify init  
   amplify add auth  
   amplify add api  
   amplify add storage  
   ```
4. **Deploy the Amplify Project:**  
   ```bash  
   amplify push
   ```
5. **Run dev server:**
    ```bash
    npm run dev
    ```

## 🤝 Contribution  
We welcome contributions to this project! 🎉  

- 🐛 Found a bug? Open an issue.  
- 🌟 Have a feature request? Submit your ideas via a pull request!  

---

## 📝 License  
This project is licensed under the MIT License. See the LICENSE file for details.  

🌟 Give this repository a star if you find it helpful! 🌟

