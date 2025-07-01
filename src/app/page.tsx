import { Flex, Text, Heading, Container, Box } from "@radix-ui/themes";

export default function Home() {
  return (
    <Container size="2" px="4">
      <Flex direction="column" gap="9" py="9">
        {/* Header */}
        <Box>
          <Heading size="6" weight="medium" color="gray">
            Antoine Pirard
          </Heading>
        </Box>

        {/* Main Content */}
        <Flex direction="column" gap="6">
          <Box>
            <Heading size="8" weight="medium" style={{ lineHeight: '1.2' }}>
              Design leader scaling startups from nothing to millions in ARR.
            </Heading>
            <Text size="4" color="blue" weight="medium" mt="2">
              — I&apos;m building experiences and teams that allow businesses to scale to their full potential.
            </Text>
          </Box>

          <Box>
            <Text size="3" color="gray" style={{ lineHeight: '1.6' }}>
              Over the last 10 years, I&apos;ve helped early-stage startup founders create products from the 
              ground up, led teams and developed successful product strategy. I thrive in strategic chaos 
              clearing and crafting the detailed experiences that make a product feel complete.
            </Text>
          </Box>
        </Flex>

        {/* Previously Section */}
        <Flex direction="column" gap="4" mt="9">
          <Text size="2" color="gray" weight="medium">
            Previously
          </Text>
          
          <Flex gap="6" align="center" wrap="wrap">
            {/* Company logos - using text placeholders for now */}
            <Box>
              <Text size="2" weight="bold" color="gray">
                rasayel
              </Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold" color="gray">
                GO Vocal
              </Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold" color="gray">
                Central App
              </Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold" color="gray">
                CAMBRIDGE
                <br />
                <Text size="1">Judge Business School</Text>
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}
