import React from "react";

function BannerFormFields({
  formData,
  errors,
  handleChange,
  shouldShowField,
  isFieldRequired,
  getFieldLabel,
  currentBannerType,
}) {
  const hasError = (fieldName) => errors[fieldName];

  const getFieldClasses = (fieldName) =>
    `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text dark:bg-gray-700 dark:text-white ${
      hasError(fieldName)
        ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-600"
    }`;

  return (
    <div className="space-y-6">
      {/* Banner Type Selection */}
      <div className="">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Banner Type
        </h3>
        <div className="mb-3">
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-text dark:bg-gray-700 dark:text-white"
          >
            <option value="homepage-carousel">Homepage Carousel</option>
            <option value="homepage">Discount Banner</option>
            <option value="advertisement">Advertisement Banner</option>
          </select>
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          {shouldShowField("title") && (
            <div className={shouldShowField("subtitle") ? "" : "md:col-span-2"}>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {getFieldLabel("title")} {isFieldRequired("title") && "*"}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required={isFieldRequired("title")}
                className={getFieldClasses("title")}
                placeholder={
                  formData.location === "advertisement"
                    ? "Internal name for this advertisement"
                    : `Enter ${getFieldLabel("title").toLowerCase()}`
                }
              />
              {hasError("title") && (
                <div className="mt-1 flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                  <p className="text-sm text-red-600">{errors.title}</p>
                </div>
              )}
            </div>
          )}

          {/* Subtitle */}
          {shouldShowField("subtitle") && (
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {getFieldLabel("subtitle")} {isFieldRequired("subtitle") && "*"}
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required={isFieldRequired("subtitle")}
                className={getFieldClasses("subtitle")}
                placeholder={`Enter ${getFieldLabel("subtitle").toLowerCase()}`}
              />
              {hasError("subtitle") && (
                <div className="mt-1 flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                  <p className="text-sm text-red-600">{errors.subtitle}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Banner Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Banner Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Position */}
          {shouldShowField("position") && (
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {getFieldLabel("position")} {isFieldRequired("position") && "*"}
              </label>
              <input
                type="number"
                id="position"
                name="position"
                min="1"
                value={formData.position}
                onChange={handleChange}
                required={isFieldRequired("position")}
                className={getFieldClasses("position")}
              />
              {hasError("position") && (
                <div className="mt-1 flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                  <p className="text-sm text-red-600">{errors.position}</p>
                </div>
              )}
            </div>
          )}

          {/* Text Position */}
          {shouldShowField("textPosition") && (
            <div>
              <label
                htmlFor="textPosition"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {getFieldLabel("textPosition")}{" "}
                {isFieldRequired("textPosition") && "*"}
              </label>
              <select
                id="textPosition"
                name="textPosition"
                value={formData.textPosition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-text dark:bg-gray-700 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {(shouldShowField("url") || shouldShowField("buttonText")) && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {formData.location === "advertisement"
              ? "Redirect Settings"
              : "Call to Action"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL */}
            {shouldShowField("url") && (
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {getFieldLabel("url")} {isFieldRequired("url") && "*"}
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required={isFieldRequired("url")}
                  className={getFieldClasses("url")}
                  placeholder={
                    formData.location === "advertisement"
                      ? "/shop"
                      : "https://example.com/page"
                  }
                />
                {formData.location === "advertisement" && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Users will be redirected here when they click the
                    advertisement
                  </p>
                )}
                {hasError("url") && (
                  <div className="mt-1 flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                    <p className="text-sm text-red-600">{errors.url}</p>
                  </div>
                )}
              </div>
            )}

            {/* Button Text */}
            {shouldShowField("buttonText") && (
              <div>
                <label
                  htmlFor="buttonText"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {getFieldLabel("buttonText")}{" "}
                  {isFieldRequired("buttonText") && "*"}
                </label>
                <input
                  type="text"
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  required={isFieldRequired("buttonText")}
                  className={getFieldClasses("buttonText")}
                  placeholder="Learn More"
                />
                {hasError("buttonText") && (
                  <div className="mt-1 flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                    <p className="text-sm text-red-600">{errors.buttonText}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Schedule
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate ? formData.startDate.slice(0, 10) : ""}
              onChange={(e) => {
                const dateValue = e.target.value;
                const dateTime = dateValue ? `${dateValue}T00:00` : "";
                const syntheticEvent = {
                  target: {
                    name: "startDate",
                    value: dateTime,
                  },
                };
                handleChange(syntheticEvent);
              }}
              required
              className={getFieldClasses("startDate")}
            />
            {hasError("startDate") && (
              <div className="mt-1 flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                <p className="text-sm text-red-600">{errors.startDate}</p>
              </div>
            )}
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate ? formData.endDate.slice(0, 10) : ""}
              onChange={(e) => {
                const dateValue = e.target.value;
                const dateTime = dateValue ? `${dateValue}T23:59` : "";
                const syntheticEvent = {
                  target: {
                    name: "endDate",
                    value: dateTime,
                  },
                };
                handleChange(syntheticEvent);
              }}
              required
              className={getFieldClasses("endDate")}
            />
            {hasError("endDate") && (
              <div className="mt-1 flex items-center">
                <i className="fas fa-exclamation-triangle text-red-500 text-sm mr-1"></i>
                <p className="text-sm text-red-600">{errors.endDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Status */}
      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Active (banner will be displayed when within schedule)
          </label>
        </div>
      </div>
    </div>
  );
}

export default BannerFormFields;
