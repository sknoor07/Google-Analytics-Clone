"use client";

import { LiveUserType, WebsiteInfoType, WebsiteType } from "@/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import WebsiteFormInput from "./_components/FormInput";
import PageViewAnalytics from "./_components/PageViewAnalytics";
import SourceWidget from "./_components/SourceWidget";
import { format } from "date-fns";
import CountriesWidget from "./_components/CountriesWidget";
import GadgetWidget from "./_components/GadgetWidget";

export type AnalyticsType =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | undefined;

export type FormDataType = {
  analyticsType: AnalyticsType;
  fromDate: Date | undefined;
  toDate: Date | undefined;
};

function WebsitePageDetail() {
  const params = useParams<{ websiteid?: string | string[] }>();
  const websiteId = Array.isArray(params.websiteid)
    ? params.websiteid[0]
    : params.websiteid;

  const [websiteList, setWebsiteList] = useState<WebsiteType[]>([]);
  const [loading, setLoading] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [liveUsers, setLiveUsers]= useState<LiveUserType[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
    analyticsType: "hourly",
    fromDate: new Date(),
    toDate: new Date(),
  });

  useEffect(() => {
    if (websiteId) {
      getWebsiteList();
    }
  }, [websiteId]);

  useEffect(() => {
    if (websiteId && formData.fromDate && formData.toDate) {
      getWebsiteAnalyticsDetails();
    }
  }, [formData, websiteId]);

  const getWebsiteList = async () => {
    try {
      const response = await axios.get("/api/website?websiteOnly=true");
      //console.log("Website Data:", response.data);
      setWebsiteList(response?.data);
    } catch (error) {
      console.error("Error fetching website data:", error);
    }
  };

  const getWebsiteAnalyticsDetails = async () => {
    try {
      setLoading(true);
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!formData.fromDate || !formData.toDate) {
        return;
      }

      getLiveUsers();

      const fromDate = format(formData.fromDate, "yyyy-MM-dd'T'00:00:00");

      const toDate = format(formData.toDate, "yyyy-MM-dd'T'23:59:59");
      const response = await axios.get(
        `/api/website?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`,
        { signal: controller.signal },
      );
      setWebsiteInfo(response?.data[0]);
      //console.log("Website Analytics Data:", response?.data[0]);
    } catch (error) {
      if (
        !(error instanceof Error) ||
        (error.name !== "AbortError" && error.name !== "CanceledError")
      ) {
        console.error("Error fetching website details:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLiveUsers= async()=>{
    console.log(websiteId);
    const result= await axios.get('/api/live-user?websiteId='+websiteId);
    //console.log(result?.data);
    setLiveUsers(result?.data);
  };

  return (
    <div className="mt-7 gap-4 flex flex-col">
      <WebsiteFormInput websiteList={websiteList} setFormData={setFormData} handleRefresh={getWebsiteAnalyticsDetails} />
      <PageViewAnalytics websiteInfo={websiteInfo} loading={loading} analyticsType={formData.analyticsType} liveUsers={liveUsers}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <SourceWidget websiteAnalytics={websiteInfo?.analytics} loading={loading}/>
      <CountriesWidget CountriesAnalytics={websiteInfo?.analytics} loading={loading}/>
      <GadgetWidget GadgetAnalytics={websiteInfo?.analytics} loading={loading}/>
      </div>
    </div>
  );
}

export default WebsitePageDetail;
