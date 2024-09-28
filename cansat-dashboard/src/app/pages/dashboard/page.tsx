"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Battery, RefreshCcw, Wifi } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

const mockData = [
  {
    time: "0",
    temperature: 24.31,
    altitude: -1.8,
    gpsAltitude: 0,
    voltage: 3.8,
    pressure: 1013,
    airQuality: 50,
    roll: 0,
    pitch: 0,
    yaw: 0,
  },
  {
    time: "1",
    temperature: 24.32,
    altitude: -2.0,
    gpsAltitude: 0,
    voltage: 3.9,
    pressure: 1012,
    airQuality: 51,
    roll: 1,
    pitch: 1,
    yaw: 1,
  },
  // ... add more initial data points
];

export default function Component() {
  const [data, setData] = useState(mockData);
  const [gpsPosition, setGpsPosition] = useState([51.505, -0.09]);
  const [batteryPercentage, setBatteryPercentage] = useState(23.81);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [healthyPackets, setHealthyPackets] = useState(136);
  const [corruptedPackets, setCorruptedPackets] = useState(0);
  const telemetryRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        time: String(parseInt(data[data.length - 1].time) + 1),
        temperature:
          data[data.length - 1].temperature + (Math.random() - 0.5) * 0.1,
        altitude: data[data.length - 1].altitude + (Math.random() - 0.5) * 0.2,
        gpsAltitude:
          data[data.length - 1].gpsAltitude + (Math.random() - 0.5) * 0.1,
        voltage: data[data.length - 1].voltage + (Math.random() - 0.5) * 0.05,
        pressure: data[data.length - 1].pressure + (Math.random() - 0.5) * 1,
        airQuality: Math.max(
          0,
          Math.min(
            100,
            data[data.length - 1].airQuality + (Math.random() - 0.5) * 2
          )
        ),
        roll: data[data.length - 1].roll + (Math.random() - 0.5) * 0.5,
        pitch: data[data.length - 1].pitch + (Math.random() - 0.5) * 0.5,
        yaw: data[data.length - 1].yaw + (Math.random() - 0.5) * 0.5,
      };
      setData((prevData) => [...prevData, newDataPoint]);
      setGpsPosition([
        gpsPosition[0] + (Math.random() - 0.5) * 0.0001,
        gpsPosition[1] + (Math.random() - 0.5) * 0.0001,
      ]);
      setBatteryPercentage((prev) =>
        Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 0.1))
      );
      setCurrentTime(new Date());
      setHealthyPackets((prev) => prev + 1);
      if (Math.random() < 0.05) setCorruptedPackets((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [data, gpsPosition]);

  useEffect(() => {
    if (telemetryRef.current) {
      telemetryRef.current.scrollTop = telemetryRef.current.scrollHeight;
    }
  }, [data]);

  const renderChart = (title, dataKey, color) => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2" style={{ color }}>
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data.slice(-50)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const getBatteryColor = (percentage) => {
    if (percentage > 60) return "#4ade80";
    if (percentage > 30) return "#fbbf24";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 overflow-hidden">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {/* <img
            src="/placeholder.svg?height=50&width=50"
            alt="DESCENDERE Logo"
            className="mr-4"
          /> */}
          <Image
            src="/cansat-robospace-logo.png"
            width={70}
            height={70}
            alt="cansat-logo"
          />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            ROBOSPACE
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-xl font-mono">
            {currentTime.toLocaleTimeString()}
          </p>
          <div className="flex items-center bg-gray-800 p-2 rounded">
            <p className="mr-2">XBEE Port: COM11</p>
            <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 space-x-4 overflow-hidden">
        <div className="w-2/3 space-y-4 overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-4">
            {renderChart("Temperature (°C)", "temperature", "#ff6b6b")}
            {renderChart("Altitude (m)", "altitude", "#4ecdc4")}
            {renderChart("Air Pressure (hPa)", "pressure", "#feca57")}
            {renderChart("Voltage (V)", "voltage", "#ff9ff3")}
            {renderChart("Air Quality (AQI)", "airQuality", "#48dbfb")}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2 text-purple-400">
                Orientation
              </h2>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data.slice(-50)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="roll"
                    stroke="#ff6b6b"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="pitch"
                    stroke="#4ecdc4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="yaw"
                    stroke="#feca57"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="w-1/3 space-y-4 flex flex-col">
          <div className="bg-gray-800 p-4 rounded-lg flex-grow">
            <h2 className="text-xl font-semibold mb-2 text-green-400">
              GPS LOCATION
            </h2>
            <div className="h-96 relative">
              <MapContainer
                center={gpsPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={gpsPosition} />
              </MapContainer>
              <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 p-2 rounded text-sm">
                <p>Latitude: {gpsPosition[0].toFixed(6)}</p>
                <p>Longitude: {gpsPosition[1].toFixed(6)}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-yellow-400">
              TELEMETRY CONTROL
            </h2>
            <div
              ref={telemetryRef}
              className="bg-gray-700 p-2 rounded h-48 overflow-y-auto text-xs"
            >
              {data.map((d, i) => (
                <p key={i} className="font-mono">
                  {`1022,${d.time.padStart(2, "0")}:${d.time.padStart(
                    2,
                    "0"
                  )},${d.temperature.toFixed(2)},${d.altitude.toFixed(
                    2
                  )},${d.gpsAltitude.toFixed(2)},${d.voltage.toFixed(2)}`}
                </p>
              ))}
            </div>
            {/* <div className="mt-4 flex justify-between">
              {["LAUNCH", "APOGEE", "FPD", "SPD", "PD"].map((label) => (
                <button
                  key={label}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </div>
      <footer className="mt-4 flex justify-between items-center bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Wifi className="mr-2 text-green-400" />
            <p className="text-green-400">Healthy Packets: {healthyPackets}</p>
          </div>
          <div className="flex items-center">
            <Wifi className="mr-2 text-red-400" />
            <p className="text-red-400">
              Corrupted Packets: {corruptedPackets}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Battery
            className="mr-2"
            style={{ color: getBatteryColor(batteryPercentage) }}
          />
          <p style={{ color: getBatteryColor(batteryPercentage) }}>
            {batteryPercentage.toFixed(2)}%
          </p>
        </div>
      </footer>
    </div>
  );
}
