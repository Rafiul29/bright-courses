"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";

const DownloadCertificate = ({ totoalProgress, courseId }) => {
  const [isCertificateDownloading, setIsCertificateDownloading] =
    useState(false);

  async function handleCertificateDownload() {
    try {
      setIsCertificateDownloading(true);

    
      setIsCertificateDownloading(true);
      fetch(`/api/certificate?courseId=${courseId}`)
        .then((response) => response.blob())
        .then((blob) => {
          console.log(blob)
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Certificate.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        })


      toast.success("Certificate has been downloaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCertificateDownloading(false);
    }
  }

  return (
    <Button disabled={totoalProgress < 100} className="w-full mt-6" onClick={handleCertificateDownload}>
      <>Download Certificate</>
    </Button>
  );
};

export default DownloadCertificate;
