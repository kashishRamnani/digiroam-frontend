import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveSettings } from "../../features";

const Footer = () => {
  const { t } = useTranslation();
  const { serviceLinks, contactList, loading } = useSelector((state) => state.settings);

  return (
    <footer className="bg-[#303030] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center">
          <img
            src="/images/roam-digi-logo.png"
            alt="Roamdigi Logo"
            className="w-64 mb-4"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[35%_30%_30%] gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-[#f67a55] mb-6">
              {t("footer.company_info_title")}
            </h2>
            <p className="text-sm text-gray-300 max-w-md">
              {t("footer.company_info_description")}
            </p>
          </div>

          {/* Follow*/}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {t("footer.services_title")}
            </h3>
            <ul className="space-y-2 pl-0">
              {serviceLinks.length > 0
                ? serviceLinks.map((service) => !service.isHidden && (
                  <li key={service.label} className="text-sm text-gray-300 hover:text-[#f67a55] list-none">
                    <Link to={service.href} target="_blank">
                      {service.label}
                    </Link>
                  </li>
                )) : "There is not any service available"}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {t("footer.contact_us_title")}
            </h3>
            <ul className="space-y-2 pl-0">
              {contactList.length > 0
                ? contactList.map((contact) => !contact.isHidden && (
                  <li key={contact.field} className="text-sm text-gray-300 list-none">
                    <span className="font-medium">{contact.field}:</span>{" "}
                    {contact?.href
                      ? <a href={contact.href} target="_blank" >{contact.label}</a>
                      : <span>{contact.label}</span>}
                  </li>
                )) : "No contact information shared"}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            {t("footer.copyright")} {new Date().getFullYear()} ROAMDIGI.{" "}
            {t("footer.all_rights_reserved")}
          </p>

          {/* Privacy Policy and Terms & Conditions Links */}
          <div className="mt-4 text-center text-sm text-gray-400">
            <Link to="/privacy-policy" className="hover:text-[#f67a55] mx-2">
              {t("footer.privacy_policy")}
            </Link>
            |
            <Link
              to="/terms-and-conditions"
              className="hover:text-[#f67a55] mx-2"
            >
              {t("footer.terms_conditions")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
