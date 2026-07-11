"use client";

import { WebsiteInfoType, WebsiteType } from "@/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import WebsiteFormInput from "./_components/FormInput";
import PageViewAnalytics from "./_components/PageViewAnalytics";
import { format } from "date-fns";

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

  const [formData, setFormData] = useState<FormDataType>({
    analyticsType: "hourly",
    fromDate: new Date(),
    toDate: new Date(),
  });

  //console.log("Website ID:", websiteId);
  useEffect(() => {
    if (websiteId) {
      getWebsiteList();
      getWebsiteAnalyticsDetails();
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
      if (!formData.fromDate || !formData.toDate) {
        return;
      }

      const fromDate = format(formData.fromDate, "yyyy-MM-dd'T'00:00:00");

      const toDate = format(formData.toDate, "yyyy-MM-dd'T'23:59:59");
      //console.log("Fetching analytics for:", { websiteId, fromDate, toDate });
      const response = await axios.get(
        `/api/website?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`,
      );
      //console.log("Website Analytics Data:", response.data[0]);
      setWebsiteInfo(response?.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching website details:", error);
    } finally {
      //console.log("Finished fetching analytics for:", { websiteId, fromDate: formData.fromDate, toDate: formData.toDate });
      setLoading(false);
    }
  };

  return (
    <div className="mt-7 gap-4 flex flex-col">
      <WebsiteFormInput websiteList={websiteList} setFormData={setFormData} handleRefresh={getWebsiteAnalyticsDetails} />
      <PageViewAnalytics websiteInfo={websiteInfo} loading={loading} analyticsType={formData.analyticsType} />
    </div>
  );
}

export default WebsitePageDetail;
