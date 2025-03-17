import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { createOrgAction } from "~/actions/organization-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useFetch from "~/hooks/use-fetch";
import {
  createOrganizationSchema,
  type CreateOrganizationSchemaType,
} from "~/lib/validators/organizationValidators";

const Onboarding = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrganizationSchemaType>({
    resolver: zodResolver(createOrganizationSchema),
  });
  const { data, error, loading, fn: createOrgFn } = useFetch(createOrgAction);
  const navigate = useNavigate();

  const onSubmit = async (data: CreateOrganizationSchemaType) => {
    await createOrgFn(data);
  };
  useEffect(() => {
    if (data) {
      toast.success("Organization created successfully");
      navigate("/dashboard/roadmap");
    }
  }, [loading, data]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-20 gap-4">
      <h1 className="text-3xl font-semibold text-white">Organization Setup</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">What is name of your organization?</label>
          <Input {...register("name")} id="name" className="bg-slate-700" />
        </div>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default Onboarding;
