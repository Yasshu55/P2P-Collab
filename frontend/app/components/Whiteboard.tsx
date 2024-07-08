'use client'
import React, { useEffect, useRef, useState,FC } from 'react';
interface RoomID {
    roomId : string
}

const Whiteboard: FC<RoomID> = ({ roomId }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Set up WebSocket connection
        wsRef.current = new WebSocket(`ws://localhost:8000?roomId=${roomId}`);

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            drawLine(context, data.x0, data.y0, data.x1, data.y1, data.color);
        };

        // Clean up WebSocket connection
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [roomId]);

    const startDrawing = (event: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        setIsDrawing(true);
        setLastX(event.clientX - rect.left);
        setLastY(event.clientY - rect.top);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (event: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        drawLine(context, lastX, lastY, x, y, 'black');
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                x0: lastX,
                y0: lastY,
                x1: x,
                y1: y,
                color: 'black',
            }));
        }

        setLastX(x);
        setLastY(y);
    };

    const drawLine = (
        context: CanvasRenderingContext2D,
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        color: string
    ) => {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
    };

    return (
        <div>
            <h1>Whiteboard</h1>
            <h2>Room ID: {roomId}</h2>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: '1px solid black' }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
            />
        </div>
    );
};

export default Whiteboard;