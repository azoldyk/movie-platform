#!/bin/bash

echo "MovieHub Platform Starter"
echo "========================"
echo

# Check if MongoDB is running
echo "Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is running."
else
    echo "MongoDB is not running. Please start MongoDB before continuing."
    echo "You can start MongoDB by running 'mongod' in a separate terminal."
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

echo
echo "Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!

echo
echo "Starting frontend development server..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting up..."
echo
echo "- Backend will be available at: http://localhost:5000/api"
echo "- Frontend will be available at: http://localhost:3000"
echo
echo "Press Ctrl+C to shut down both servers."

# Wait for user to press Ctrl+C
trap "echo; echo 'Shutting down servers...'; kill $BACKEND_PID $FRONTEND_PID; echo 'Done.'; exit 0" INT
wait 