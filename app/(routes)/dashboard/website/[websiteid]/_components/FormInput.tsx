import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteType } from "@/type";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { AnalyticsType, FormDataType } from "../page";

export type FormInputProps = {
  websiteList: WebsiteType[],
  setFormData: (formData: FormDataType) => void;
  handleRefresh: (flag:boolean) =>void;
};


function WebsiteFormInput({ websiteList, setFormData, handleRefresh }: FormInputProps) {
  const params = useParams<{ websiteid?: string | string[] }>();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Default to one week from now
  });

  const websiteId = Array.isArray(params.websiteid)
    ? params.websiteid[0]
    : params.websiteid;

  const [selectedValue, setSelectedValue] = useState(websiteId ?? "");
  const handleAnalyticsTypeChange = (value: string) => {
  if (
    value === "hourly" ||
    value === "daily" ||
    value === "weekly" ||
    value === "monthly"
  ) {
    setAnalyticsType(value);
  }
};
  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>("hourly");

  useEffect(() => {
    setSelectedValue(websiteId ?? "");
  }, [websiteId]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    router.push(`/dashboard/website/${value}`);
  };

  useEffect(() => {
    setFormData({
      analyticsType: analyticsType,
      fromDate: dateRange?.from,
      toDate: dateRange?.to??dateRange?.from,
    })
  },[analyticsType, dateRange])

  return (
    <div className="flex gap-4 items-center justify-between">
      <div className=" flex gap-3 items-center">
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Website" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {websiteList.map((website) => (
                <SelectItem key={website.websiteId} value={website.websiteId}>
                  {website.domain.replace(/^https?:\/\/(www\.)?/, "")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dateRange}
              className="w-[230px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange?.to ? (
                  `${format(dateRange.from, "PP")} - ${format(dateRange.to, "PP")}`
                ) : (
                  format(dateRange.from, "PP")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="rounded-lg border w-[480px]"
            />
          </PopoverContent>
        </Popover>
        <Select value={analyticsType} onValueChange={handleAnalyticsTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Analytics Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button className="h-10 w-10" variant="outline" onClick={() => handleRefresh(true)}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Button className="h-10 w-10" variant="outline">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default WebsiteFormInput;
