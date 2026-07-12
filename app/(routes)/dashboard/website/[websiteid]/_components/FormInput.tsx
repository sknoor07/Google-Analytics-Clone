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
import {
  Calendar as CalendarIcon,
  RefreshCw,
  Settings,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { AnalyticsType, FormDataType } from "../page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";

export type FormInputProps = {
  websiteList: WebsiteType[];
  setFormData: (formData: FormDataType) => void;
  handleRefresh: (flag: boolean) => void;
};

function WebsiteFormInput({
  websiteList,
  setFormData,
  handleRefresh,
}: FormInputProps) {
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
      toDate: dateRange?.to ?? dateRange?.from,
    });
  }, [analyticsType, dateRange]);

  // --- Handlers for the settings menu ---
  const handleDelete = async () => {
    try {
      await axios.delete('/api/website', {
        data: { websiteId: websiteId },
      });
      toast.success('Website Deleted!');
      router.replace('/dashboard');
    } catch (error) {
      toast.error('Failed to delete website. Please try again.');
      console.error('Delete website error', error);
    }
  };

  const handleMoreSettings = () => {
    router.push(`/dashboard/website/${websiteId}/settings`);
  };

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
        <Button
          className="h-10 w-10"
          variant="outline"
          onClick={() => handleRefresh(true)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-10 w-10" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} className="w-48 p-1.5">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm h-9 px-2"
              onClick={handleMoreSettings}
            >
              <SlidersHorizontal className="h-4 w-4" />
              More Settings
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm h-9 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your website from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button  variant='destructive' className=" text-white" onClick={handleDelete}>Delete</ Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default WebsiteFormInput;
