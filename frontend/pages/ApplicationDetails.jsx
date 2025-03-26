import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style/listing.css";
import greenDot from "../public/assets/green-dot.svg";
import grayDot from "../public/assets/grey-dot.svg";
import DEFAULT_NO_IMAGE from "../public/assets/default_icon_listing.png";
import loaderGif from "../public/assets/loader.gif";
import axios from "axios";
import urlJoin from "url-join";

const EXAMPLE_MAIN_URL = window.location.origin;

export const ApplicationDetails = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const DOC_URL_PATH =
    "/help/docs/sdk/latest/platform/company/catalog/#getProducts";
  const DOC_APP_URL_PATH =
    "/help/docs/sdk/latest/platform/application/catalog#getAppProducts";
  const { application_id, company_id } = useParams();
  const documentationUrl = "https://api.fynd.com";
  const [applicationId, setApplicationId] = useState('');
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    isApplicationLaunch() ? fetchApplicationProducts() : fetchProducts();
  }, [application_id]);

  const fetchProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        urlJoin(EXAMPLE_MAIN_URL, "/api/products"),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchApplicationProducts = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        urlJoin(
          EXAMPLE_MAIN_URL,
          `/api/products/application/${application_id}`
        ),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setProductList(data.items);
    } catch (e) {
      console.error("Error fetching application products:", e);
    } finally {
      setPageLoading(false);
    }
  };

  const productProfileImage = (media) => {
    if (!media || !media.length) {
      return DEFAULT_NO_IMAGE;
    }
    const profileImg = media.find((m) => m.type === "image");
    return profileImg?.url || DEFAULT_NO_IMAGE;
  };

  const getDocumentPageLink = () => {
    return documentationUrl
      .replace("api", "partners")
      .concat(isApplicationLaunch() ? DOC_APP_URL_PATH : DOC_URL_PATH);
  };

  const isApplicationLaunch = () => !!application_id;

  const fetchApplicationDetails = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        urlJoin(
          EXAMPLE_MAIN_URL,
          `/api/application/${applicationId}/details`
        ),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setDetails(data);
      console.log("Application Detail",data);
    } catch (e) {
      console.error("Error fetching application details:", e);
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <>
      {pageLoading ? (
        <div className="loader" data-testid="loader">
          <img src={loaderGif} alt="loader GIF" />
        </div>
      ) : (
        <div className="products-container">
          <div className="title">
            This is an example extension of Plateform Application Details.
          </div>
          <input
            type="text"
            placeholder="Enter Application ID"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          />
          <button onClick={fetchApplicationDetails}>Fetch Details</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {details && (
            <div>
              <h2>Details:</h2>
              <p>
                <strong>Name:</strong> {details.name}
              </p>
              <p>
                <strong>Status:</strong> {details.status}
              </p>
              <p>
                <strong>Domains:</strong> {details.domains?.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
