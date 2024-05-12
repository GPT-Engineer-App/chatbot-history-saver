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

  const handleSendMessage = () => {
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
    const newMessage = {
      id: Date.now(),
      text: message,
    };
    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
  };

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
        <Input placeholder="Type your message here..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
        <Button leftIcon={<FaPaperPlane />} colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
