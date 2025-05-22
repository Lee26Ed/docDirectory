"use client";
import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Rating,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "./doctorBanner.module.css";
import Image from "next/image";
import BookAppointment from "./BookAppointment";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@mantine/hooks";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";

interface DoctorBannerProps {
  doctorInfo: {
    name: string;
    specialty: string;
    profileImage: string;
    location: string;
    bio: string;
    doctorId: number;
    rating: number;
  };
}

const DoctorBanner = ({ doctorInfo }: DoctorBannerProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const handleRedirect = async () => {
    if (status === "authenticated") {
      const res = await fetch(
        `${BACKEND_API_URL}/api/v1/schedule/${doctorInfo.doctorId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.backendToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setSchedule(data);
      open();
    } else {
      router.push("/auth/login");
    }
  };
  return (
    <Container>
      <div className={classes.wrapper}>
        <Image
          src={`/docs/${doctorInfo.profileImage}`}
          alt="Doctor Banner"
          width={400}
          height={300}
          className={classes.image}
        />
        <div className={classes.body}>
          <Title className={classes.title}>{doctorInfo.name}</Title>
          <Badge color="green">{doctorInfo.specialty}</Badge>

          <Text>
            <strong>Location:</strong> {doctorInfo.location}
          </Text>
          <Group justify="start" mt="sm">
            <Text>
              <strong>Rating: </strong>{" "}
            </Text>
            <Rating fractions={4} defaultValue={doctorInfo.rating} readOnly />
          </Group>

          <Text className={classes.description} mb={20}>
            {doctorInfo.bio}
          </Text>
          <Button onClick={handleRedirect}>Book an appointment</Button>
          <BookAppointment opened={opened} close={close} schedule={schedule} />
        </div>
      </div>
    </Container>
  );
};

export default DoctorBanner;
