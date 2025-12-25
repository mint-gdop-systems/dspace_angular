#!/bin/bash

# Ministry Resource Portal Startup Script

echo "Starting Ministry of Innovation & Technology Resource Portal..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install django djangorestframework django-cors-headers requests
else
    source venv/bin/activate
fi

# Start Django backend
echo "Starting Django backend server..."
cd backend
python manage.py migrate
python manage.py runserver 8000 &
BACKEND_PID=$!
cd ..

# Start React frontend
echo "Starting React frontend server..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🚀 Servers started successfully!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "👨‍💼 Django Admin: http://localhost:8000/admin"
echo ""
echo "🔗 External Services:"
echo "📚 Koha OPAC: http://127.0.0.1:8085"
echo "📖 DSpace: http://localhost:4000"
echo "🔍 Library Portal: http://localhost/library-portal.php"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait