import { useEffect, useMemo, useState } from "react"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  value?: Date
  onChange: (date?: Date) => void
}

export function DatePicker({ value: defaultValue, onChange }: DatePickerProps) {
  const [value, setValue] = useState<Date | undefined>(defaultValue)

  const months = useMemo(generateMonths, [])
  const years = useMemo(generateYears, [])

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(defaultValue)
    }
  }, [value, defaultValue])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto pb-0">
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={value?.getMonth().toString()}
            onValueChange={(v) => {
              const newMonth = new Date(
                value?.getFullYear() ?? new Date().getFullYear(),
                parseInt(v),
              )
              setValue(newMonth)
              onChange(newMonth)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(({ label, value }) => (
                <SelectItem
                  key={value}
                  value={new Date(0, value).getMonth().toString()}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={value?.getFullYear().toString()}
            onValueChange={(v) => {
              const newYear = new Date(
                parseInt(v),
                value?.getMonth() ?? new Date().getMonth(),
              )
              setValue(newYear)
              onChange(newYear)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(day) => {
            setValue(day ?? value)
            onChange(day)
          }}
          month={value}
          onMonthChange={setValue}
        />
      </PopoverContent>
    </Popover>
  )
}

function generateMonths() {
  return Array.from({ length: 12 }, (_, i) => ({
    label: format(new Date(0, i), "MMMM"),
    value: i,
  }))
}

function generateYears() {
  return Array.from(
    { length: new Date().getFullYear() - 1970 + 1 },
    (_, i) => ({
      label: (1970 + i).toString(),
      value: (1970 + i).toString(),
    }),
  )
}
