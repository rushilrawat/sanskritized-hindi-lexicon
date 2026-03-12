import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface DataFallbackProps {
  message?: string;
}

const DataFallback = ({ message }: DataFallbackProps) => {
  const { t } = useTranslation();

  return (
    <div className="container-page">
      <div className="card-elevated max-w-md mx-auto p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {t("data.unavailable", "Data Unavailable")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {message || t("data.error", "Data could not be loaded. Please check that the data file exists and is properly formatted.")}
        </p>
      </div>
    </div>
  );
};

export default DataFallback;
