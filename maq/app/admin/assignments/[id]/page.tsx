"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ClientSelect = dynamic(() => import("@/components/ReactSelect"), {
  ssr: false,
});

interface Question {
  _id: string;
  text: string;
}

export default function AssessmentReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isPast, setIsPast] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [assignmentRes, usersRes, questionsRes] = await Promise.all([
        fetch(`/api/admin/assignments/${id}`),
        fetch("/api/admin/users"),
        fetch("/api/admin/questions"),
      ]);

      const assignmentData = await assignmentRes.json();
      const usersData = await usersRes.json();
      const questionsData = await questionsRes.json();

      setAssessment(assignmentData);
      setFormData({
        ...assignmentData,
        startTime: new Date(assignmentData.startTime)
          .toISOString()
          .slice(0, 16),
        users: assignmentData.users.map((u: any) =>
          typeof u === "string" ? u : u.email
        ),
        questions: assignmentData.questionIds?.map((q: any) => q._id),
        companyName: assignmentData.companyName || "",
      });

      setIsPast(new Date(assignmentData.startTime) < new Date());
      setAllUsers(usersData);
      setAllQuestions(questionsData);
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, values: string[]) => {
    setFormData((prev: any) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setAssessment(updated);
        setIsEditing(false);
      } else {
        console.log("Failed to update assignment");
      }
    } catch (err) {
      console.log("Error updating assignment:", err);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const logoformData = new FormData();
    logoformData.append("file", file);

    if (formData.logo) {
      logoformData.append("previousLogoUrl", formData.logo); // pass old logo URL
    }

    try {
      const uploadRes = await fetch("/api/updateLogo", {
        method: "POST",
        body: logoformData,
      });

      const result = await uploadRes.json();

      if (uploadRes.ok && result.url) {
        setFormData((prev: any) => ({ ...prev, logo: result.url }));
        setLogoPreview(result.url);
      } else {
        throw new Error(result.error || "Logo upload failed");
      }
    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  // UI rendering ...

  console.log("assessment:", assessment);

  if (!assessment) {
    return (
      <div className="p-6">
        <div className="relative w-fit font-bold font-mono whitespace-pre text-[30px] leading-[1.2em] h-[1.2em] overflow-hidden">
          <div className="before:content-['Loading...\\A⌰oading...\\A⌰⍜ading...\\A⌰⍜⏃ding...\\A⌰⍜⏃⎅ing...\\A⌰⍜⏃⎅⟟ng...\\A⌰⍜⏃⎅⟟⋏g...\\A⌰⍜⏃⎅⟟⋏☌...\\A⌰⍜⏃⎅⟟⋏☌⟒..\\A⌰⍜⏃⎅⟟⋏☌⟒⏁.\\A⌰⍜⏃⎅⟟⋏☌⟒⏁⋔'] before:inline-block before:whitespace-pre animate-decode" />
        </div>

        <style jsx>{`
          @keyframes decode {
            100% {
              transform: translateY(-100%);
            }
          }
          .animate-decode {
            animation: decode 1s infinite steps(11) alternate;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full h-[94vh] overflow-auto py-6 px-40 spacsty   ">
      <h1 className="text-2xl font-bold mb-2">
        Assessment:{" "}
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            className="border border-gray-300 px-2 py-1 rounded ml-2"
          />
        ) : (
          assessment.title
        )}
      </h1>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Description:</label>
        {isEditing ? (
          <textarea
            name="description"
            rows={10}
            value={formData.description || ""}
            onChange={handleChange}
            className="border border-gray-300 w-full px-2 py-1 ml-4 rounded"
          />
        ) : (
          <p className="ml-4">{assessment.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Instructions:</label>
        {isEditing ? (
          <textarea
            name="instructions"
            rows={10}
            value={formData.instructions || ""}
            onChange={handleChange}
            className="border border-gray-300 w-full px-2 ml-4 py-1 rounded"
          />
        ) : (
          <p className="ml-4">{assessment.instructions}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Declaration:</label>
        {isEditing ? (
          <textarea
            name="declarationContent"
            rows={10}
            value={formData.declarationContent || ""}
            onChange={handleChange}
            className="border border-gray-300 w-full px-2 ml-4 py-1 rounded"
          />
        ) : (
          <p className="ml-4">{assessment.declarationContent}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Start Time:</label>
        {isEditing ? (
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="border border-gray-300 w-fit px-2 py-1 rounded ml-4"
          />
        ) : (
          <p className="ml-4">{new Date(assessment.startTime).toLocaleString()}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Duration (minutes):</label>
        {isEditing ? (
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="border border-gray-300 px-2 py-1 ml-4 rounded"
          />
        ) : (
          <p className="ml-4">{assessment.durationMinutes} minutes</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Company Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleChange}
            className="border border-gray-300 px-2 py-1 ml-4 rounded w-full"
          />
        ) : (
          <p className="ml-4">{assessment.companyName || "N/A"}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block mb-2">Logo:</label>
        {isEditing ? (
          <div className="space-y-2">
            {formData.logo || logoPreview ? (
              <img
                src={logoPreview || formData.logo}
                alt="Assessment Logo"
                className="h-24 object-contain border rounded"
              />
            ) : (
              <p>No logo uploaded yet</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block"
            />
          </div>
        ) : assessment.logo ? (
          <img
            src={assessment.logo}
            alt="Assessment Logo"
            className="h-24 w-fit ml-4 object-contain border rounded"
          />
        ) : (
          <p className="ml-4">No logo provided</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Users:</label>
        {isEditing ? (
          <ClientSelect
            isMulti
            name="users"
            styles={{
              option: (base: any, state: any) => ({
                ...base,
                backgroundColor: state.isFocused ? "#eee" : "#000",
                color: "#000",
                cursor: "pointer",
              }),
            }}
            value={formData.users.map((email: string) => ({
              value: email,
              label: email,
            }))}
            options={allUsers.map((user: any) => ({
              value: user.email,
              label: user.email,
            }))}
            onChange={(selected: any) =>
              handleSelectChange(
                "users",
                selected.map((s: any) => s.value)
              )
            }
          />
        ) : (
          <ul className="list-disc pl-6">
            {assessment.users.map((user: any, index: number) => (
              <li key={index}>
                {typeof user === "string" ? user : user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold block">Questions:</label>
        {isEditing ? (
          <ClientSelect
            isMulti
            name="questions"
            styles={{
              option: (base: any, state: any) => ({
                ...base,
                backgroundColor: state.isFocused ? "#eee" : "#000",
                color: "#000",
                cursor: "pointer",
              }),
            }}
            value={formData.questions.map((id: string) => {
              const q = allQuestions.find((q) => (q as Question)._id === id);
              return q
                ? { value: (q as Question)._id, label: (q as Question).text }
                : { value: id, label: id };
            })}
            options={allQuestions.map((q: any) => ({
              value: q._id,
              label: q.text,
            }))}
            onChange={(selected: any) =>
              handleSelectChange(
                "questions",
                selected.map((s: any) => s.value)
              )
            }
          />
        ) : (
          <ul className="list-disc pl-6">
            {assessment.questionIds?.map((q: any, idx: number) => (
              <li key={idx}>{q.text}</li>
            ))}
          </ul>
        )}
      </div>
      {/* Edit Assessment button (always shown or conditionally if needed) */}
      <div className="flex justify-end mt-4">
        {isEditing ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Save Assessment
          </button>
        ) : (
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => setIsEditing(true)}
          >
            Edit Assessment
          </button>
        )}
      </div>

      {/* Marks entry section (only shown if assessment is in the past) */}
      {isPast && (
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Enter Marks for Candidates</h2>
          <div className="space-y-4">
            {assessment.users.map((user: any, index: number) => {
              const email = typeof user === "string" ? user : user.email;
              const mark = assessment.marks?.[email] ?? "";

              return (
                <div key={index} className="flex items-center gap-4">
                  <label className="w-48">{email}</label>
                  <input
                    type="number"
                    className="border border-gray-300 px-2 py-1 rounded w-32"
                    placeholder="Enter marks"
                    value={formData.marks?.[index]?.score ?? mark} // Use index to track marks as an array
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFormData((prev: any) => {
                        const updatedMarks = [...(prev.marks || [])];
                        updatedMarks[index] = {
                          email,
                          score: isNaN(value) ? undefined : value, // Store score as number
                        };
                        return {
                          ...prev,
                          marks: updatedMarks,
                        };
                      });
                    }}
                  />
                </div>
              );
            })}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Save Marks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
