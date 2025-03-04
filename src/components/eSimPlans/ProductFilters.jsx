import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { locationCodes } from "../../utils/data";
import { filterProductSchema } from "../../schemas/allSchema";

const ProductFilters = () => {
  const dispatch = useDispatch();
  const types = ["BASE", "TOPUP"];

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(filterProductSchema),
    defaultValues: {
      locationCode: "",
      type: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(fetchProducts(data));
    if (fetchProducts.fulfilled.match(result)) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:flex-row gap-4 py-4 items-center"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="locationCode" className="text-gray-700">
          <i className="fas fa-map-marker-alt text-blue-500"></i>
        </label>
        <select
          id="locationCode"
          {...register("locationCode")}
          className="w-48 px-4 py-2 border bg-white rounded-md  focus:ring focus:ring-blue-300"
        >
          <option value="" >Select Location Code</option>
          {locationCodes.map((code) => (
            <option key={code.id} className="bg-white" value={code.id}>
              {code.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="type" className="text-gray-700">
          <i className="fas fa-layer-group text-blue-500"></i>
        </label>
        <select
          id="type"
          {...register("type")}
          className="w-48 px-4 py-2 bg-white border rounded-md shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">Select Type</option>
          {types.map((type) => (
            <option key={type} className="bg-white" value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
      >
        Search
      </button>
    </form>
  );
};

export default ProductFilters;
