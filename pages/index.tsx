import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { TableRowType } from "../src/common/types/gristData";
import { FacilityInfo } from "../src/components/FacilityInfo";
import { FacilitiesMap } from "../src/components/Map";
import { Search } from "../src/components/Search";
import { Sidebar } from "../src/components/Sidebar";
import { FeatureType } from "../src/lib/requests/geocode";
const citylabLogo = "images/citylab_logo.svg";

interface FetcherReturnType {
  records: TableRowType[];
}
const fetcher = async (url: string): Promise<FetcherReturnType> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Home: NextPage = () => {
  const { data, error } = useSWR(`/api/grist`, fetcher);
  const [selectedFacility, setSelectedFacility] = useState<TableRowType | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>();

  const handleMarkerClick = (facilityId: number) => {
    if (!data) return;
    const selectedFacility = data?.records.find(
      (facility) => facility.id === facilityId
    );
    if (!selectedFacility) return;
    setSelectedFacility(selectedFacility);
  };

  const handleSearchResult = (place: FeatureType) => {
    setMapCenter(place.center);
  };

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>Psychologische Unterstützung in Berlin - Prototyp</title>
      </Head>
      <div className="w-screen h-screen grid grid-cols-1 grid-rows-[auto_1fr]">
        <header className="px-4 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-gray-50">
          <h1>
            <strong>Psychologische Unterstützung</strong> <span>in Berlin</span>
          </h1>
          <div className="flex gap-3 items-center">
            <span className="text-md">Ein Prototyp des</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={citylabLogo}
              alt="Logo des CityLAB Berlin"
              className="h-8 w-auto"
            />
          </div>
        </header>
        <div className="w-full h-full grid grid-cols-[4fr_8fr]">
          <Sidebar>
            {selectedFacility && (
              <FacilityInfo
                facility={selectedFacility}
                onClose={() => setSelectedFacility(null)}
              />
            )}
            {!selectedFacility && (
              <Search onSelectResult={handleSearchResult} />
            )}
          </Sidebar>
          {!data && !error && <p>Lade ...</p>}
          {data && (
            <FacilitiesMap
              center={mapCenter}
              markers={data.records}
              onMarkerClick={handleMarkerClick}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
