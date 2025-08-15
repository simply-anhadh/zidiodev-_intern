# Excel Analytics Platform

A comprehensive MERN stack application for uploading, analyzing, and visualizing Excel data with interactive charts and AI-powered insights.

## 🚀 Features

### Core Functionality
- **File Upload & Processing**: Support for .xlsx and .xls files with SheetJS parsing
- **Dynamic Chart Generation**: Interactive 2D and 3D charts using Chart.js and Three.js
- **Data Visualization**: Bar, line, pie, scatter, and 3D column charts
- **Export Capabilities**: Download charts as PNG or PDF
- **User Dashboard**: Upload history, analytics, and usage statistics
- **Admin Panel**: User management and system monitoring

### Authentication & Security
- JWT-based authentication
- Role-based access control (User/Admin)
- Secure file upload handling
- Session management

### Chart Types
- 2D Bar Charts
- 2D Line Charts
- 2D Pie Charts
- 2D Scatter Plots
- 3D Column Charts (Three.js)

### Tech Stack
- **Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS
- **Charts**: Chart.js, Three.js
- **UI Components**: Headless UI, Framer Motion
- **File Processing**: SheetJS (xlsx)
- **Export**: jsPDF, html2canvas

## 🛠 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd excel-analytics-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 Backend Setup

For the complete MERN stack implementation, you'll need to set up the backend:

### Backend Dependencies
```bash
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer xlsx
npm install -D nodemon @types/node
```

### Backend Structure
```
backend/
├── models/
│   ├── User.js
│   ├── Upload.js
│   └── Chart.js
├── routes/
│   ├── auth.js
│   ├── uploads.js
│   ├── charts.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── utils/
│   └── excelParser.js
└── server.js
```

### Environment Variables
Create a `.env` file in the backend:
```
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

## 📊 Demo Accounts

For testing purposes, use these demo accounts:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**User Account:**
- Email: user@example.com
- Password: user123

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Backend (Render)
1. Create a new web service on Render
2. Connect your repository
3. Set environment variables
4. Deploy

## 🔑 Key Features Implementation

### File Upload Processing
- Drag-and-drop interface
- Excel file validation
- SheetJS parsing integration
- Progress indicators

### Chart Generation
- Dynamic axis selection
- Real-time chart preview
- Multiple chart type support
- Interactive chart controls

### Data Management
- Upload history tracking
- User analytics
- Storage management
- Chart gallery

### Admin Dashboard
- User management
- System monitoring
- Usage statistics
- Performance metrics

## 📈 Future Enhancements

- **AI Integration**: OpenAI API for data insights
- **Real-time Collaboration**: Multiple users editing charts
- **Advanced Filters**: Complex data filtering options
- **Scheduled Reports**: Automated report generation
- **API Integration**: External data source connections

## 🧪 Testing

The application includes comprehensive mock data for testing all features without requiring actual Excel uploads.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.