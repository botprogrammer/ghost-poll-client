// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPoll = async (data: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/polls/create-poll`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to create poll",
    };
  }

  return response.json();
};

export const getPollBySlug = async (slug: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/polls/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to fetch poll",
    };
  }

  return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const udpatePoll = async (slug: string, data: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DATABASE_URL}/polls/${slug}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to update poll",
    };
  }

  return response.json();
};
