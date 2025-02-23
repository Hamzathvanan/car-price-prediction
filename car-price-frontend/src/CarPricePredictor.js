import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, TextField, MenuItem, Button, CircularProgress, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";
import { DirectionsCar, AttachMoney, BarChartOutlined, ShowChart } from "@mui/icons-material";
import { motion } from "framer-motion";

const CarPricePrediction = () => {
  const [formData, setFormData] = useState({
    model: "",
    year: "",
    motor_type: "",
    running: "",
    wheel: "",
    color: "",
    type: "",
    status: "",
    motor_volume: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Dropdown options for categorical fields
  const modelOptions = ["kia", "nissan", "hyundai", "mercedes-benz", "toyota"];
  const motorTypeOptions = ["petrol", "gas", "petrol and gas"];
  const wheelOptions = ["left", "right"];
  const colorOptions = ["black", "white", "silver", "blue", "gray", "other", "brown", "red", "green", "orange", "cherry", "skyblue", "clove", "beige"];
  const typeOptions = ["sedan", "suv", "Universal", "Coupe", "hatchback"];
  const statusOptions = ["excellent", "normal", "good", "crashed", "new"];

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle prediction request
  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data.predicted_price);

      // Update chart data
      setChartData([...chartData, { id: chartData.length + 1, price: response.data.predicted_price }]);
    } catch (error) {
      console.error("Prediction Error:", error);
    }
    setLoading(false);
  };

  // Define colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>

      {/* Form Card */}
      <Card sx={{ maxWidth: 500, mt: 5, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            <DirectionsCar sx={{ fontSize: 40, color: "#1976D2" }} /> Car Price Prediction
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField select fullWidth label="Model" name="model" value={formData.model} onChange={handleChange}>
                {modelOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Year" name="year" value={formData.year} onChange={handleChange} />
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Motor Type" name="motor_type" value={formData.motor_type} onChange={handleChange}>
                {motorTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Running (km/miles)" name="running" value={formData.running} onChange={handleChange} />
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Wheel Type" name="wheel" value={formData.wheel} onChange={handleChange}>
                {wheelOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Color" name="color" value={formData.color} onChange={handleChange}>
                {colorOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Type" name="type" value={formData.type} onChange={handleChange}>
                {typeOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange}>
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Motor Volume" name="motor_volume" value={formData.motor_volume} onChange={handleChange} />
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handlePredict} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Predict Price"}
          </Button>

          {prediction !== null && (
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              <AttachMoney sx={{ fontSize: 30, color: "green" }} /> Predicted Price: ${prediction}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart Visualization */}
      <ResponsiveContainer width="50%" height={300} sx={{ mt: 4 }}>
        <BarChart data={chartData}>
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#1976D2" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CarPricePrediction;
