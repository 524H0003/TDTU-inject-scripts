"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Calendar } from "@/components/shadcn/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/shadcn/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/shadcn/ui/field";
import { Label } from "@/components/shadcn/ui/label";
import { useEffect, useState } from "react";

import { Input } from "../shadcn/ui/input";

export function CalendarWithTime({
  date = new Date(),
  onDateChange,
}: {
  date?: Date;
  onDateChange: (date: Date) => void;
}) {
  const initialTime = date
    ? new Date(date).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "00:00";

  const [time, setTime] = useState<string>(initialTime);

  useEffect(() => {
    const [hours, minutes] = time.split(":").map(Number);
    const localDate = new Date(date);
    localDate.setHours(hours);
    localDate.setMinutes(minutes);
    onDateChange(localDate);
  }, [date, time]);

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          required
          className="p-0"
        />
      </CardContent>
      <CardFooter className="bg-card border-t">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-input">Giờ hạn chót</FieldLabel>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="time-input" className="sr-only">
                  Giờ
                </Label>
                <Input
                  id="time-input"
                  type="time"
                  step="60"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
}
