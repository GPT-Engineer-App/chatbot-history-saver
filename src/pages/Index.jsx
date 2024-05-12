import React, { useState, useEffect } from "react";
import { Container, VStack, Text, Input, Button, Box, useToast } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

const Index = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const fetchApiResponse = async () => {
    const response = await fetch("https://api.example.com/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.response;
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      toast({
        title: "Empty message",
        description: "You can't send an empty message.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const apiResponse = await fetchApiResponse();
    const newMessage = {
      id: Date.now(),
      text: message,
    };
    const responseMessage = {
      id: Date.now() + 1,
      text: apiResponse,
    };
    setChatHistory([...chatHistory, newMessage, responseMessage]);
    setMessage("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast({
        title: "File uploaded",
        description: `Received file: ${file.name}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const autoRespond = (message) => {
    const response = {
      id: Date.now(),
      text: `Auto-response: Received '${message}'`,
    };
    setChatHistory([...chatHistory, response]);
  };

  useEffect(() => {
    if (chatHistory.length && chatHistory[chatHistory.length - 1].text !== message) {
      autoRespond(message);
    }
  }, [chatHistory]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Chatbot Interface</Text>
        <Box width="100%" maxHeight="300px" overflowY="scroll" border="1px" borderColor="gray.200" p={3}>
          {chatHistory.map((msg) => (
            <Text key={msg.id} p={2} borderBottom="1px" borderColor="gray.100">
              {msg.text}
            </Text>
          ))}
        </Box>
        <Input type="file" onChange={handleFileUpload} />
        <Input placeholder="Type your message here..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
        <Button leftIcon={<FaPaperPlane />} colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
