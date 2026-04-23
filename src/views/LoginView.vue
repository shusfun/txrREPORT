<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { markAuthenticated, verifyCredentials } from "../auth";

const router = useRouter();
const route = useRoute();
const account = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const canSubmit = computed(
  () => Boolean(account.value.trim()) && Boolean(password.value),
);

function resolveRedirectPath(value: unknown) {
  if (typeof value !== "string") {
    return "/overview";
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return "/overview";
  }

  return value;
}

async function handleSubmit() {
  if (loading.value) {
    return;
  }

  errorMessage.value = "";

  if (!canSubmit.value) {
    errorMessage.value = "请输入账号和密码";
    return;
  }

  loading.value = true;

  try {
    const passed = await verifyCredentials(account.value, password.value);

    if (!passed) {
      errorMessage.value = "账号或密码不正确";
      return;
    }

    markAuthenticated();
    await router.replace(resolveRedirectPath(route.query.redirect));
  } catch {
    errorMessage.value = "当前浏览器无法完成登录校验";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-card__header">
        <p class="login-card__eyebrow">访问验证</p>
        <h1 class="login-card__title">请输入账号和密码</h1>
        <p class="login-card__desc">登录后即可继续访问当前系统内容。</p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="login-field">
          <span class="login-field__label">账号</span>
          <el-input
            v-model="account"
            size="large"
            placeholder="请输入账号"
            autocomplete="username"
            :disabled="loading"
          />
        </label>

        <label class="login-field">
          <span class="login-field__label">密码</span>
          <el-input
            v-model="password"
            size="large"
            type="password"
            show-password
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
          />
        </label>

        <p v-if="errorMessage" class="login-form__error">{{ errorMessage }}</p>

        <el-button
          class="login-form__submit"
          type="primary"
          native-type="submit"
          size="large"
          :loading="loading"
        >
          登录
        </el-button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(50, 125, 255, 0.18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.12), transparent 28%),
    linear-gradient(180deg, #f4f8ff 0%, #eef2f8 100%);
}

.login-card {
  width: min(100%, 420px);
  padding: 36px 32px 32px;
  border: 1px solid rgba(29, 59, 113, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 56px rgba(21, 45, 89, 0.12);
}

.login-card__header {
  margin-bottom: 28px;
}

.login-card__eyebrow {
  margin: 0 0 10px;
  font-size: 13px;
  color: #4f6b95;
  letter-spacing: 0.08em;
}

.login-card__title {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  color: #1a2b4a;
}

.login-card__desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5d6b82;
}

.login-form {
  display: grid;
  gap: 18px;
}

.login-field {
  display: grid;
  gap: 8px;
}

.login-field__label {
  font-size: 14px;
  color: #1f2f4f;
}

.login-form__error {
  margin: -4px 0 0;
  font-size: 13px;
  color: #d03050;
}

.login-form__submit {
  width: 100%;
  margin-top: 4px;
}

@media (max-width: 640px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    padding: 28px 20px 24px;
    border-radius: 20px;
  }

  .login-card__title {
    font-size: 24px;
  }
}
</style>
