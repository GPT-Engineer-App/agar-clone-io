import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, Input, Flex } from "@chakra-ui/react";

const WORLD_SIZE = 3000;
const INITIAL_PLAYER_RADIUS = 20;
const INITIAL_FOOD_COUNT = 200;

const Index = () => {
  const [player, setPlayer] = useState({ x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, radius: INITIAL_PLAYER_RADIUS });
  const [food, setFood] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const worldRef = useRef(null);

  useEffect(() => {
    generateFood();
    const handleMouseMove = (e) => {
      const worldRect = worldRef.current.getBoundingClientRect();
      const mouseX = e.clientX - worldRect.left;
      const mouseY = e.clientY - worldRect.top;
      const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
      const speed = 5;
      setPlayer((prev) => ({
        ...prev,
        x: prev.x + Math.cos(angle) * speed,
        y: prev.y + Math.sin(angle) * speed,
      }));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [player]);

  useEffect(() => {
    const foodToRemove = food.filter((f) => {
      const dist = Math.sqrt((f.x - player.x) ** 2 + (f.y - player.y) ** 2);
      return dist < player.radius;
    });
    if (foodToRemove.length > 0) {
      setFood((prev) => prev.filter((f) => !foodToRemove.includes(f)));
      setPlayer((prev) => ({ ...prev, radius: prev.radius + foodToRemove.length }));
    }
  }, [food, player]);

  const generateFood = () => {
    const newFood = [];
    for (let i = 0; i < INITIAL_FOOD_COUNT; i++) {
      newFood.push({
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      });
    }
    setFood(newFood);
  };

  const worldStyle = {
    position: "relative",
    width: WORLD_SIZE,
    height: WORLD_SIZE,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
    cursor: "crosshair",
    transformOrigin: "left top",
    transform: `scale(${zoom})`,
  };

  return (
    <Box>
      <Flex mb={4}>
        <Input placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} mr={4} />
        <Button onClick={() => setZoom((prev) => prev * 1.1)}>Zoom In</Button>
        <Button onClick={() => setZoom((prev) => prev / 1.1)} ml={2}>
          Zoom Out
        </Button>
      </Flex>
      <Box ref={worldRef} sx={worldStyle}>
        <Box
          sx={{
            position: "absolute",
            left: player.x,
            top: player.y,
            width: player.radius * 2,
            height: player.radius * 2,
            borderRadius: "50%",
            backgroundColor: "blue",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text color="white" fontSize="sm">
            {playerName || "Player"}
          </Text>
        </Box>
        {food.map((f, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: f.x,
              top: f.y,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: f.color,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Index;
