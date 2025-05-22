import React from "react";
import { Doctor } from "@/types/doctor";
import { Box, Center, Flex, Loader, Text } from "@mantine/core";
import DoctorCard from "./DoctorCard";

interface DoctorsListProps {
  loading: boolean;
  error: string;
  Doctors: Doctor[];
}

function DoctorsList({ loading, error, Doctors }: DoctorsListProps) {
  return (
    <Box mt={50}>
      <Center>
        {loading && <Loader size={38} />}
        {error && <Text c={"red"}>{error}</Text>}
        {!loading && Doctors.length > 0 && (
          <Flex
            mih={50}
            gap="lg"
            justify="center"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            {Doctors.map((doctor) => (
              <DoctorCard key={doctor.doctorId} doctor={doctor} />
            ))}
          </Flex>
        )}
      </Center>
    </Box>
  );
}

export default DoctorsList;
