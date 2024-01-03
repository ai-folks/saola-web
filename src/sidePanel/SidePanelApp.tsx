import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Heading, Textarea, VStack, Text } from "@chakra-ui/react";


import LoadingSpinner from 'src/components/LoadingSpinner';
import { useAppSelector } from "src/state/hooks/useAppDispatch";
import PortNames from 'src/types/PortNames';

const SidePanelApp = () => {
  const port = useRef<chrome.runtime.Port>();
  const [isConnected, setIsConnected] = React.useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const connect = async () => {
    const sidePanelPort = chrome.runtime.connect({ name: PortNames.SidePanelPort });
    port.current = sidePanelPort;
    sidePanelPort.postMessage({ type: 'init', message: 'init from panel open' });

    sidePanelPort.onMessage.addListener(message => {
      if (message.type === 'handle-init') {
        setIsConnected(true);
      }

      if (message.type === 'tab-updated') {
        sidePanelPort.postMessage({ type: 'init', message: 'init from tab connected' });
      }
    });
  };

  useEffect(() => {
    connect();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue('');
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    !isConnected ? (
      <Box height="100vh">
        <LoadingSpinner />
      </Box>
    ) : (
      <Container height="100vh">
        <VStack height="100%" spacing={4}>
          <Box flex="1" overflowY="auto" ref={scrollRef} width="100%">
            {messages.map((message, index) => (
              <Text key={index}>{message}</Text>
            ))}
          </Box>
          <Textarea
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </VStack>
      </Container>
    )
  );
};

export default SidePanelApp;
