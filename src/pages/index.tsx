import useTranslation from 'next-translate/useTranslation';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';

export default function Home() {
  const alphabets = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [glossaries, setGlossaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [alphabet, setAlphabet] = useState("#");
  const { t } = useTranslation('common');

  useEffect(() => {
    // fetchdata
    fetch("https://cms.businessintegritymyanmar.thibi.co/api/glossaries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        // console.log(data);
        setGlossaries(data.data);
        setLoading(false);
      }).catch((err) => {
        // console.log(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  let filterGlossaries = [];
  if (alphabet === "#") {
    filterGlossaries = [...glossaries];
  } else {
    filterGlossaries = glossaries.filter(
      (glossary) =>
        glossary["attributes"]["en_term"][0] === alphabet
    );
  }

  return (
    <>
      <Layout>
        <div className="h-full px-8 sm:px-28 py-12">
          <div className="container px-4 mx-auto">
            <section className="text-center">
              <div
                className={`pb-6 text-xl sm:text-2xl font-bold`}
              >
                {t('title')}
              </div>
              <div
                className={`px-8 pb-6 text-sm sm:text-base text-gray-700`}
              >
                {t('description')}
              </div>
            </section>
            <section className="flex flex-col items-center">
              <div className="w-full mx-10 overflow-x-auto myscrollbar">
                <div className="flex lg:justify-center gap-x-4 text-sm sm:text-lg">
                  {alphabets.map((elt) => (
                    <div key={elt}>
                      <span
                        onClick={() => setAlphabet(elt)}
                        className={`${
                          elt === alphabet ? "text-blue-800 font-bold underline" : ""
                        } cursor-pointer font-kantumruy`}
                      >
                        {elt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full sm:w-4/5 mt-4 px-8 sm:px-16 py-1 sm:py-2 text-sm sm:text-xl text-white rounded-t-lg bg-primary">
                {alphabet}
              </div>
              <div className="w-full sm:w-4/5 flex flex-col px-8 sm:px-16 pt-4 pb-8 gap-y-5 overflow-auto myscrollbar text-sm sm:text-lg bg-slate-50 rounded-b-lg">
                <div id="start"></div>
                {error && <div>Could not load the content.</div>}

                {loading ? (
                  <div>Loading...</div>
                ) : filterGlossaries.length > 0 ? (
                  filterGlossaries.map((glossary) => (
                    <div key={glossary["id"]}>
                      <div className="underline font-kantumruy font-bold">
                        {glossary["attributes"]["en_term"]}
                      </div>
                      <div className="mt-2 font-padauk text-gray-600">
                        {glossary["attributes"]["mm_term"]}
                      </div>
                    </div>
                  ))
                ) : (
                    <div>No Glossary</div>
                )}
              </div>
              <div className="my-2 sm:my-4">
                <a
                  href="#start"
                  className={`underline text-sm sm:text-lg cursor-pointer`}
                >
                  {t("gotoTop")}
                </a>
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
}
